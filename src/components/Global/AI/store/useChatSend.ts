import { createGlobalState } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import { STREAMING_FLUSH_DEBOUNCE_MS } from '../config/constants'
import { buildSystemPrompt } from '../prompts/business/system'
import { playNotificationSound } from '../utils/playNotificationSound'
import { useAIPreferences } from './useAIPreferences'
import { useChatInput } from './useChatInput'
import { useConversationStore } from './useConversationStore'
import { useStreamManager } from './useStreamManager'

export const useChatSend = createGlobalState(() => {
  const { inputText, inputRef } = useChatInput()
  const _aiPrefs = useAIPreferences()
  const { currentId, messages: _messages, addMessage } = useConversationStore()
  const {
    startStreaming,
    appendThinkingContent,
    appendStreamingContent,
    finishStreaming,
    getSignal: _getSignal,
    isConversationLoading,
  } = useStreamManager()

  const cachedSystemPrompt = ref('')

  function _getSystemPrompt(): string {
    if (!cachedSystemPrompt.value) {
      cachedSystemPrompt.value = buildSystemPrompt()
    }
    return cachedSystemPrompt.value
  }

  function handleSend() {
    const text = inputText.value.trim()
    if (!text || isConversationLoading(currentId.value))
      return

    inputText.value = ''
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.style.height = 'auto'
      }
    })

    addMessage('user', text)
    const cid = currentId.value

    startStreaming(cid)
    addMessage('assistant', '')

    let pendingChunk = ''
    let flushTimer: ReturnType<typeof setTimeout> | null = null

    function scheduleFlush() {
      if (flushTimer)
        clearTimeout(flushTimer)
      flushTimer = setTimeout(() => {
        flushTimer = null
        const chunk = pendingChunk
        pendingChunk = ''
        if (chunk)
          appendStreamingContent(cid, chunk)
      }, STREAMING_FLUSH_DEBOUNCE_MS)
    }

    function flushPending() {
      if (flushTimer) {
        clearTimeout(flushTimer)
        flushTimer = null
      }
      if (pendingChunk) {
        appendStreamingContent(cid, pendingChunk)
        pendingChunk = ''
      }
    }

    const _callbacks = {
      onThink: (chunk: string) => {
        appendThinkingContent(cid, chunk)
      },
      onChunk: (chunk: string) => {
        pendingChunk += chunk
        scheduleFlush()
      },
      onDone: () => {
        flushPending()
        finishStreaming(cid, 'done')
        playNotificationSound()
      },
      onError: (error: Error) => {
        flushPending()
        if (error.name === 'AbortError') {
          finishStreaming(cid, 'abort')
        }
        else {
          appendStreamingContent(cid, `\n\n[Error: ${error.message}]`)
          finishStreaming(cid, 'error')
        }
      },
    }

    // TODO: 接入目标项目的 AI API
    // import { sendAiMessage } from '@/api/ai'  // ← 按目标项目的 API 模式创建
    // sendAiMessage(_messages.value, {
    //   ..._callbacks,
    //   systemPrompt: _getSystemPrompt(),
    //   deepThinking: _aiPrefs.value.deepThinking,
    //   signal: _getSignal(cid),
    // })
    //
    // 当前占位 — 直接模拟完成：
    _callbacks.onDone()
  }

  function handleQuickCommand(query: string) {
    if (isConversationLoading(currentId.value))
      return
    inputText.value = query
    handleSend()
  }

  return { handleSend, handleQuickCommand }
})
