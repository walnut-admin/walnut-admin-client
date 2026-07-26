import type { Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { EXPAND_STATE_CACHE_MAX } from '../config/constants'
import { LRUMap } from '../utils/cache'
import { useConversationStore } from './useConversationStore'

const MAX_CACHED_MESSAGES = EXPAND_STATE_CACHE_MAX

const thinkingMap = new LRUMap<string, Ref<boolean>>(MAX_CACHED_MESSAGES)
const interruptedMap = new LRUMap<string, Ref<boolean>>(MAX_CACHED_MESSAGES)

export const useMessageExpandState = createGlobalState(() => {
  const { currentId } = useConversationStore()

  /** Get (or create) the expand state ref for a message's thinking section */
  function getThinkingExpanded(msgId: string): Ref<boolean> {
    let v = thinkingMap.get(msgId)
    if (!v) {
      v = ref(false)
      thinkingMap.set(msgId, v)
    }
    return v
  }

  /** Toggle the expand state of a message's thinking section */
  function toggleThinking(msgId: string) {
    const expanded = getThinkingExpanded(msgId)
    expanded.value = !expanded.value
  }

  /** Get (or create, defaulting to true) the expand state ref for an interrupted message */
  function getInterruptedExpanded(msgId: string): Ref<boolean> {
    let v = interruptedMap.get(msgId)
    if (!v) {
      v = ref(true)
      interruptedMap.set(msgId, v)
    }
    return v
  }

  /** Toggle the expand state of an interrupted message */
  function toggleInterrupted(msgId: string) {
    const expanded = getInterruptedExpanded(msgId)
    expanded.value = !expanded.value
  }

  /** Clear all expand state caches (called on conversation switch) */
  function clearExpandState() {
    thinkingMap.clear()
    interruptedMap.clear()
  }

  /**
   * WHAT: Clears thinking/interrupted expand states for all messages when switching conversations
   *
   * Use case: Each conversation maintains independent expand/collapse UI state
   * Side effect: Calls clearExpandState() — clears thinkingMap and interruptedMap
   */
  watch(currentId, () => {
    clearExpandState()
  })

  return {
    getThinkingExpanded,
    toggleThinking,
    getInterruptedExpanded,
    toggleInterrupted,
    clearExpandState,
  }
})
