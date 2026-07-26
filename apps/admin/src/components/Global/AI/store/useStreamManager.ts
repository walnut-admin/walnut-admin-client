import type { Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { extractJSON, isBufferWaitingForJSON } from '../utils/parser'
import { getBusinessSummary, parseBusinessContent } from '../utils/parser/business'
import { useConversationStore } from './useConversationStore'

interface StreamState {
  isLoading: Ref<boolean>
  streamingContent: Ref<string>
  thinkingContent: Ref<string>
  abortController: AbortController | null
  lastPatchedLength: number
}

const streamStates = new Map<string, StreamState>()

function getStreamState(id: string): StreamState {
  if (!streamStates.has(id)) {
    streamStates.set(id, {
      isLoading: ref(false),
      streamingContent: ref(''),
      thinkingContent: ref(''),
      abortController: null,
      lastPatchedLength: 0,
    })
  }
  return streamStates.get(id)!
}

export const useStreamManager = createGlobalState(() => {
  const { conversations, currentId, scheduleSave, saveConversations, appendLastMessage } = useConversationStore()

  // -- computed (for current active conversation) --

  const isLoading = computed(() => getStreamState(currentId.value).isLoading.value)
  const currentStreamingContent = computed(() => getStreamState(currentId.value).streamingContent.value)
  const currentThinkingContent = computed(() => getStreamState(currentId.value).thinkingContent.value)

  // -- Clean up inactive stream states on conversation switch --

  /**
   * WHAT: Removes stream states for conversations that are not active and not currently loading
   *
   * Use case: Memory management — prevents accumulation of AbortControllers and refs for old conversations
   * Side effect: Deletes entries from streamStates Map; preserves states of conversations still streaming
   */
  watch(currentId, (newId) => {
    for (const [id, state] of streamStates) {
      if (id !== newId && !state.isLoading.value) {
        streamStates.delete(id)
      }
    }
  })

  // -- helpers --

  function getLastAssistantMessage(conversationId: string): IAIMessage | undefined {
    const conv = conversations.value.find(c => c.id === conversationId)
    const lastMsg = conv?.messages[conv.messages.length - 1]
    return lastMsg?.role === 'assistant' ? lastMsg : undefined
  }

  // -- streaming actions --

  /** Initialize stream state for a conversation and create a new AbortController */
  function startStreaming(conversationId: string, initialContent = '') {
    const state = getStreamState(conversationId)
    state.streamingContent.value = initialContent
    state.thinkingContent.value = ''
    state.isLoading.value = true
    state.abortController = new AbortController()
    state.lastPatchedLength = 0
  }

  /** Append a chunk to the thinking/chain-of-thought content and update the last assistant message */
  function appendThinkingContent(conversationId: string, chunk: string) {
    const state = getStreamState(conversationId)
    state.thinkingContent.value += chunk

    const lastMsg = getLastAssistantMessage(conversationId)
    if (lastMsg) {
      lastMsg.thinkingContent = state.thinkingContent.value
    }
  }

  /** Append a streaming content chunk, attempting JSON business content extraction; falls back to raw text update */
  function appendStreamingContent(conversationId: string, chunk: string) {
    const state = getStreamState(conversationId)
    state.streamingContent.value += chunk

    const buf = state.streamingContent.value
    const lastMsg = getLastAssistantMessage(conversationId)
    const alreadyHasBusinessContent = lastMsg?.businessContent

    // Only parse JSON if this message doesn't already have a business type set
    if (!alreadyHasBusinessContent) {
      const jsonStr = extractJSON(buf)

      if (jsonStr) {
        try {
          const parsed = JSON.parse(jsonStr)
          const bc = parseBusinessContent(parsed)

          if (bc || typeof parsed.content === 'string') {
            if (lastMsg) {
              if (bc) {
                lastMsg.businessContent = bc
                lastMsg.content = getBusinessSummary(bc)
              }
              else {
                lastMsg.content = parsed.content as string
              }
            }
            // Keep content after JSON (e.g. report HTML after {"type":"report"})
            const jsonEnd = buf.indexOf(jsonStr) + jsonStr.length
            state.streamingContent.value = buf.slice(jsonEnd).trimStart()
            state.lastPatchedLength = 0
            scheduleSave()
            return
          }
        }
        catch {
          // JSON parse failed — keep accumulating
        }
      }

      if (isBufferWaitingForJSON(buf))
        return
    }

    // Only send the delta since last patch, not the full buffer (O(n) instead of O(n²))
    const delta = buf.slice(state.lastPatchedLength)
    if (delta) {
      appendLastMessage(conversationId, delta, () => state.isLoading.value)
      state.lastPatchedLength = buf.length
    }
  }

  /** Mark conversation as finished streaming, persist thinking content, and clean up stream state */
  function finishStreaming(conversationId: string, reason: 'done' | 'abort' | 'error' = 'done') {
    const state = streamStates.get(conversationId)
    if (!state)
      return

    const lastMsg = getLastAssistantMessage(conversationId)

    if (reason === 'abort' && lastMsg) {
      lastMsg.interrupted = true
    }

    if (lastMsg && state.thinkingContent.value) {
      lastMsg.thinkingContent = state.thinkingContent.value

      // 思考模式下 AI 可能将 JSON 放在 reasoning_content 中，兜底提取业务 JSON
      if (!lastMsg.businessContent) {
        const jsonStr = extractJSON(state.thinkingContent.value)
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr)
            const bc = parseBusinessContent(parsed)
            if (bc) {
              lastMsg.businessContent = bc
              lastMsg.content = getBusinessSummary(bc)
            }
          }
          catch { /* JSON 解析失败，忽略 */ }
        }
      }
    }

    state.isLoading.value = false
    state.streamingContent.value = ''
    state.thinkingContent.value = ''
    state.abortController = null

    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      conv.updatedAt = Date.now()
      saveConversations(conversations.value, (pruned) => {
        conversations.value = pruned
      })
    }
  }

  /** Abort an active stream via AbortController. State cleanup is handled by finishStreaming('abort') in the onError callback */
  function abortStreaming(conversationId: string) {
    const state = streamStates.get(conversationId)
    if (!state)
      return
    state.isLoading.value = false
    state.abortController?.abort()
  }

  /** Get the AbortSignal for an active stream (undefined if not streaming) */
  function getSignal(conversationId: string) {
    return streamStates.get(conversationId)?.abortController?.signal
  }

  /** Check if a conversation currently has an active stream */
  function isConversationLoading(conversationId: string) {
    return streamStates.get(conversationId)?.isLoading.value ?? false
  }

  /** Remove stream state entry for a conversation (used on conversation deletion) */
  function removeStreamState(id: string) {
    streamStates.delete(id)
  }

  return {
    isLoading,
    currentStreamingContent,
    currentThinkingContent,
    startStreaming,
    appendThinkingContent,
    appendStreamingContent,
    finishStreaming,
    abortStreaming,
    getSignal,
    isConversationLoading,
    removeStreamState,
  }
})
