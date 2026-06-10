import type { Virtualizer } from '@tanstack/vue-virtual'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useConversationStore } from '../store/useConversationStore'

export function useStickyUserMessage(
  virtualizer: Ref<Virtualizer<HTMLElement, Element>>,
  scrollContainer: Ref<HTMLElement | null>,
) {
  const { messages } = useConversationStore()
  const showStickyBar = ref(false)
  const activeStickyMessage = ref<IAIMessage | null>(null)

  /**
   * Scan virtual list measurements from bottom to top to find the first user message
   * that has scrolled off the top of the viewport. If found, show the sticky bar with
   * its content so the user can see which question they are replying to.
   */
  function update() {
    const container = scrollContainer.value
    if (!container) {
      showStickyBar.value = false
      activeStickyMessage.value = null
      return
    }

    const scrollTop = container.scrollTop

    // At the very top — nothing scrolled off
    if (scrollTop <= 0) {
      showStickyBar.value = false
      activeStickyMessage.value = null
      return
    }

    // Content doesn't overflow the viewport
    if (container.scrollHeight <= container.clientHeight + 1) {
      showStickyBar.value = false
      activeStickyMessage.value = null
      return
    }

    const v = virtualizer.value
    let candidate: IAIMessage | null = null

    for (let i = messages.value.length - 1; i >= 0; i--) {
      if (messages.value[i].role !== 'user')
        continue
      const item = v.measurementsCache[i]
      if (item && item.index === i && item.end < scrollTop) {
        candidate = messages.value[i]
        break
      }
    }

    showStickyBar.value = candidate !== null
    activeStickyMessage.value = candidate
  }

  return {
    showStickyBar,
    activeStickyMessage,
    update,
  }
}
