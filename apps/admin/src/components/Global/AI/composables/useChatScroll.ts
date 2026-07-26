import { nextTick, watch } from 'vue'
import { useAIPreferences } from '../store/useAIPreferences'
import { useChatVirtualList } from '../store/useChatVirtualList'
import { useConversationStore } from '../store/useConversationStore'
import { usePanelState } from '../store/usePanelState'
import { useStickyUserMessage } from './useStickyUserMessage'

/**
 * Aggregates all scroll-triggering watchers and sticky bar coordination
 * that were previously scattered in ChatPanel.vue.
 */
export function useChatScroll() {
  const { currentId } = useConversationStore()
  const { visible: isExpanded } = usePanelState()
  const aiPrefs = useAIPreferences()
  const { virtualizer, scrollContainerRef, scrollToBottom, handleScroll: handleVirtualScroll } = useChatVirtualList()

  // ── Sticky user question bar ──
  const { showStickyBar, activeStickyMessage, update: updateStickyBar } = useStickyUserMessage(virtualizer, scrollContainerRef)

  function handleMessagesScroll() {
    handleVirtualScroll()
    updateStickyBar()
  }

  // Scroll to bottom when panel becomes visible
  watch(isExpanded, (expanded) => {
    if (expanded) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  }, { immediate: true })

  // Scroll to bottom after panel mode transitions (panel ↔ large-panel ↔ content-aside)
  watch(() => aiPrefs.value.panelMode, (newMode, oldMode) => {
    if (newMode === oldMode || !isExpanded.value)
      return
    nextTick(() => {
      scrollToBottom()
    })
  })

  // Reset sticky bar and scroll to bottom on conversation switch
  watch(currentId, () => {
    showStickyBar.value = false
    activeStickyMessage.value = null
    scrollToBottom()
  })

  return {
    showStickyBar,
    activeStickyMessage,
    handleMessagesScroll,
  }
}
