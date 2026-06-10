import { createGlobalState } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import { useConversationStore } from './useConversationStore'
import { useStreamManager } from './useStreamManager'

export const useChatInput = createGlobalState(() => {
  const inputText = ref('')
  const isFocused = ref(false)
  const inputRef = useTemplateRef<HTMLTextAreaElement>('inputRef')

  const { currentId } = useConversationStore()
  const { isConversationLoading } = useStreamManager()

  const canSend = computed(() =>
    inputText.value.trim().length > 0 && !isConversationLoading(currentId.value),
  )

  return { inputText, inputRef, isFocused, canSend }
})
