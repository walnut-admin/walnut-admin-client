// src/components/Global/AI/composables/business/index.ts
import { watch } from 'vue'
import { ACTION_HANDLER_MAP } from '../../config/business/actionRegistry'
import { useConversationStore } from '../../store/useConversationStore'

/**
 * WHAT: Watches latest assistant message for action-type businessContent and dispatches to handler.
 *
 * Use case: ChatPanel calls this once at setup. When the AI outputs an action-type
 * business JSON, the watcher fires → looks up ACTION_HANDLER_MAP → executes →
 * clears businessContent so the message returns to normal text display.
 *
 * No per-type composable needed — just add entries to ActionPayloadMap and
 * ACTION_HANDLER_MAP.
 */
export function useActionWatcher() {
  const { messages, patchLastAssistantMessage } = useConversationStore()

  watch(
    () => {
      const msgs = messages.value
      if (msgs.length === 0)
        return null
      const last = msgs[msgs.length - 1]
      if (last.role !== 'assistant' || !last.businessContent)
        return null
      if (last.businessContent.category !== 'action')
        return null
      return { msg: last, bc: last.businessContent }
    },
    (data) => {
      if (!data)
        return
      const handler = ACTION_HANDLER_MAP[data.bc.type as keyof ActionPayloadMap]
      if (handler) {
        Promise.resolve(handler(data.bc as any)).then(() => {
          patchLastAssistantMessage({ businessContent: undefined })
        })
      }
    },
    { deep: false },
  )
}

/**
 * WHAT: Generic Card-type interaction helpers (confirm / cancel).
 *
 * Use case: Card components (BusinessCard + registered card components) call
 * these to confirm or dismiss a rendered business card. Extend with real
 * implementations as needed.
 */
export function useCardActions() {
  function confirmCard(_messageId: string) { /* TODO */ }
  function cancelCard(_messageId: string) { /* TODO */ }
  return { confirmCard, cancelCard }
}
