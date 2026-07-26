import { createGlobalState } from '@vueuse/core'
import { clearFormatCache } from '@/components/Global/AI/utils/format'
import { useConversationStore } from './useConversationStore'
import { useStreamManager } from './useStreamManager'

/**
 * Coordinates cross-cutting operations between useConversationStore and useStreamManager.
 * Exists to break the circular dependency between the two stores.
 */
export const useConversationLifecycle = createGlobalState(() => {
  const store = useConversationStore()
  const stream = useStreamManager()

  /** Delete a conversation: abort streaming, remove stream state, splice from list, persist, and switch if it was active */
  function deleteConversation(id: string) {
    stream.abortStreaming(id)
    stream.removeStreamState(id)

    const idx = store.conversations.value.findIndex(c => c.id === id)
    if (idx === -1)
      return

    store.conversations.value.splice(idx, 1)
    clearFormatCache()
    store.saveConversations(store.conversations.value, (pruned) => {
      store.conversations.value = pruned
    })

    if (store.currentId.value === id) {
      store.currentId.value = store.conversations.value[0]?.id || ''
    }
  }

  return { deleteConversation }
})
