import { createGlobalState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useChatInput } from './useChatInput'
import { useChatSend } from './useChatSend'
import { useConversationStore } from './useConversationStore'

export const useInputHistory = createGlobalState(() => {
  const { inputText } = useChatInput()
  const { messages, currentId } = useConversationStore()
  const { handleSend } = useChatSend()

  const inputHistory = ref<string[]>([])
  const historyIndex = ref(-1)
  const draftInput = ref('')

  /** Rebuild the input history array from the current conversation's user messages and reset navigation state */
  function rebuildInputHistory() {
    inputHistory.value = messages.value
      .filter(m => m.role === 'user')
      .map(m => m.content)
    inputText.value = ''
    historyIndex.value = -1
    draftInput.value = ''
  }

  /**
   * WHAT: Rebuilds input history list from current conversation's user messages
   *
   * Use case: Enables arrow-up/down navigation through previously sent messages in the current conversation
   * Side effect: Resets inputText, historyIndex, and draftInput; triggers immediately on mount via { immediate: true }
   */
  watch(currentId, () => {
    rebuildInputHistory()
  }, { immediate: true })

  /** Save the current text to input history (called after successful send) and reset navigation */
  function commitToHistory(text: string) {
    historyIndex.value = -1
    draftInput.value = ''
    inputHistory.value.push(text)
  }

  /** Handle ArrowUp/ArrowDown for history navigation and Enter to send. Resets history index on any other key */
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (inputHistory.value.length === 0)
        return
      if (historyIndex.value === -1)
        draftInput.value = inputText.value
      if (historyIndex.value < inputHistory.value.length - 1) {
        historyIndex.value++
        inputText.value = inputHistory.value[inputHistory.value.length - 1 - historyIndex.value]
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex.value <= 0) {
        inputText.value = draftInput.value
        historyIndex.value = -1
      }
      else {
        historyIndex.value--
        inputText.value = inputHistory.value[inputHistory.value.length - 1 - historyIndex.value]
      }
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
      return
    }

    historyIndex.value = -1
  }

  return { inputHistory, historyIndex, draftInput, commitToHistory, handleKeydown }
})
