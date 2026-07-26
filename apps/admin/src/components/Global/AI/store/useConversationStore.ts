import { createGlobalState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { clearFormatCache } from '@/components/Global/AI/utils/format'
import { SAVE_DEBOUNCE_MS, STORAGE_KEY_CONVERSATIONS, TITLE_TRUNCATE_LENGTH } from '../config/constants'

const STORAGE_KEY = STORAGE_KEY_CONVERSATIONS

function generateId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function loadConversations(): IAIConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw)
      return []
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data))
      return []
    return data.flatMap((item) => {
      const c = item as Record<string, unknown>
      if (!Array.isArray(c.messages))
        return []
      const messages = (c.messages as Array<Record<string, unknown>>).map(m => ({
        ...m,
        timestamp: new Date(m.timestamp as string),
      })) as IAIMessage[]
      return [{ ...c, messages }] as unknown as IAIConversation[]
    })
  }
  catch { /* ignore parse error */ }
  return []
}

function saveConversations(conversations: IAIConversation[], onPruned?: (pruned: IAIConversation[]) => void) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  }
  catch (e) {
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22)) {
      if (conversations.length > 1) {
        console.warn('[AI] localStorage 配额已满，尝试清理旧对话')
        const pruned = conversations.slice(0, -1)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned))
          onPruned?.(pruned)
        }
        catch { /* still failed after pruning */ }
      }
      else {
        console.warn('[AI] localStorage 配额已满，无法保存对话')
      }
    }
  }
}

export const useConversationStore = createGlobalState(() => {
  const conversations = ref<IAIConversation[]>(loadConversations())
  const currentId = ref<string>(conversations.value[0]?.id || '')

  // -- Debounced save: coalesces rapid writes to reduce JSON.stringify overhead --
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  function scheduleSave() {
    if (saveTimer)
      clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saveTimer = null
      saveConversations(conversations.value, (pruned) => {
        conversations.value = pruned
      })
    }, SAVE_DEBOUNCE_MS)
  }

  /** Force flush — cancels debounce timer and persists immediately */
  function flushSave() {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    saveConversations(conversations.value, (pruned) => {
      conversations.value = pruned
    })
  }

  const currentConversation = computed(() =>
    conversations.value.find(c => c.id === currentId.value) ?? null,
  )

  /** Create a new conversation if none exists; called implicitly by addMessage */
  function ensureConversation() {
    if (!currentConversation.value) {
      const id = generateId()
      conversations.value.unshift({
        id,
        title: '新对话',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      currentId.value = id
    }
  }

  // -- computed --

  const messages = computed(() => currentConversation.value?.messages ?? [])

  const conversationList = computed(() =>
    conversations.value
      .map(c => ({
        id: c.id,
        title: c.title,
        count: c.messages.length,
        updatedAt: c.updatedAt,
        isActive: c.id === currentId.value,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt),
  )

  const hasMessages = computed(() => messages.value.length > 0)

  const latestMessageId = computed(() => messages.value[messages.value.length - 1]?.id ?? null)

  // -- mutations --

  /** Append a message to the current conversation. First user message auto-titles the conversation */
  function addMessage(role: 'user' | 'assistant', content: string) {
    ensureConversation()
    const conv = currentConversation.value
    if (!conv)
      return

    conv.messages.push({
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role,
      content,
      timestamp: new Date(),
    })
    conv.updatedAt = Date.now()

    if (role === 'user' && conv.title === '新对话') {
      conv.title = content.slice(0, TITLE_TRUNCATE_LENGTH) + (content.length > TITLE_TRUNCATE_LENGTH ? '...' : '')
    }

    scheduleSave()
  }

  /** Update the content of the last assistant message in a given conversation. Used by streaming to progressively update content */
  function patchLastMessage(conversationId: string, content: string, isLoading: () => boolean) {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (!conv)
      return
    const lastMsg = conv.messages[conv.messages.length - 1]
    // Caller already called addMessage('assistant', '') before streaming starts, so the last message must be assistant
    if (!lastMsg || lastMsg.role !== 'assistant') {
      console.warn('[patchLastMessage] Last message is not assistant, skipping update')
      return
    }
    lastMsg.content = content
    if (!isLoading())
      saveConversations(conversations.value)
  }

  /** Append a delta to the last assistant message content. Used by streaming to incrementally update without O(n²) full-buffer rewrites */
  function appendLastMessage(conversationId: string, delta: string, isLoading: () => boolean) {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (!conv)
      return
    const lastMsg = conv.messages[conv.messages.length - 1]
    if (!lastMsg || lastMsg.role !== 'assistant') {
      console.warn('[appendLastMessage] Last message is not assistant, skipping update')
      return
    }
    lastMsg.content += delta
    if (!isLoading())
      saveConversations(conversations.value)
  }

  /** Replace the last assistant message entirely with partial IAIMessage updates. Used for clearing businessContent after consumption */
  function patchLastAssistantMessage(updates: Partial<IAIMessage>) {
    const conv = currentConversation.value
    if (!conv)
      return
    const lastMsg = conv.messages[conv.messages.length - 1]
    if (lastMsg && lastMsg.role === 'assistant') {
      const idx = conv.messages.indexOf(lastMsg)
      conv.messages.splice(idx, 1, { ...lastMsg, ...updates } as IAIMessage)
    }
    scheduleSave()
  }

  /** Create a new empty conversation and switch to it (effectively clearing the current chat) */
  function clearMessages() {
    const id = generateId()
    conversations.value.unshift({
      id,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    currentId.value = id
    clearFormatCache()
    flushSave()
  }

  /** Switch active conversation by ID */
  function switchConversation(id: string) {
    currentId.value = id
  }

  /** Remove a specific message from a conversation */
  function deleteMessage(conversationId: string, messageId: string) {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (!conv)
      return
    const idx = conv.messages.findIndex(m => m.id === messageId)
    if (idx === -1)
      return
    conv.messages.splice(idx, 1)
    conv.updatedAt = Date.now()
    flushSave()
  }

  /** Rename a conversation and persist immediately */
  function updateConversationTitle(id: string, title: string) {
    const conv = conversations.value.find(c => c.id === id)
    if (!conv)
      return
    conv.title = title
    conv.updatedAt = Date.now()
    flushSave()
  }

  /** Check if a message ID belongs to the last message in the current conversation */
  function isLatestMessage(id: string): boolean {
    return messages.value[messages.value.length - 1]?.id === id
  }

  return {
    // internal (used by useStreamManager & useConversationLifecycle)
    conversations,
    saveConversations,
    patchLastMessage,
    appendLastMessage,
    patchLastAssistantMessage,
    currentConversation,
    // public
    currentId,
    messages,
    hasMessages,
    conversationList,
    latestMessageId,
    isLatestMessage,
    addMessage,
    clearMessages,
    switchConversation,
    deleteMessage,
    updateConversationTitle,
    scheduleSave,
    // Force flush — cancels debounce timer and persists immediately
    flushSave,
  }
})
