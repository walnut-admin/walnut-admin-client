import { useVirtualizer } from '@tanstack/vue-virtual'
import { createGlobalState } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { BUSINESS_TYPE_HEIGHTS } from '../config/business/registry'
import { DEFAULT_VIRTUAL_ITEM_HEIGHT, HEIGHTS_CACHE_MAX, ITEM_HEIGHT_BASE, ITEM_HEIGHT_MAX_LINES, ITEM_HEIGHT_PER_LINE, SCROLL_NEAR_BOTTOM_PX, SCROLL_SUPPRESS_MS, THINKING_ITEM_HEIGHT, VIRTUAL_LIST_GAP, VIRTUAL_LIST_OVERSCAN } from '../config/constants'
import { LRUMap } from '../utils/cache'
import { useConversationStore } from './useConversationStore'

export const useChatVirtualList = createGlobalState(() => {
  const { messages, currentId } = useConversationStore()
  const scrollContainerRef = ref<HTMLElement | null>(null)
  const showScrollButton = ref(false)

  const measuredHeights = new LRUMap<string, number>(HEIGHTS_CACHE_MAX)

  let programmaticScrollCount = 0
  let suppressUntil = 0

  const virtualizer = useVirtualizer({
    get count() { return messages.value.length },
    getScrollElement: () => scrollContainerRef.value,
    estimateSize: (index: number) => {
      const msg = messages.value[index]
      if (!msg)
        return DEFAULT_VIRTUAL_ITEM_HEIGHT
      const cached = measuredHeights.get(msg.id)
      if (cached)
        return cached
      const meta = msg.businessContent && BUSINESS_TYPE_HEIGHTS[msg.businessContent.type]
      if (meta)
        return meta
      if (msg.role === 'assistant' && msg.thinkingContent)
        return THINKING_ITEM_HEIGHT
      const lines = Math.min(msg.content?.split('\n').length || 1, ITEM_HEIGHT_MAX_LINES)
      return ITEM_HEIGHT_BASE + lines * ITEM_HEIGHT_PER_LINE
    },
    gap: VIRTUAL_LIST_GAP,
    overscan: VIRTUAL_LIST_OVERSCAN,
  })

  /**
   * WHAT: Auto-scrolls virtual list to bottom when new messages arrive or last message content changes
   *
   * Use case: Streaming AI responses — each chunk appends content, triggering scroll follow
   * Side effect: Calls virtualizer.scrollToIndex(); skipped if user scrolled up (showScrollButton is true)
   */
  watch(
    () => [
      messages.value.length,
      messages.value[messages.value.length - 1]?.content,
    ] as const,
    () => {
      if (showScrollButton.value)
        return
      nextTick(() => {
        const v = virtualizer.value
        v.measure()
        programmaticScrollCount++
        v.scrollToIndex(messages.value.length - 1, { align: 'end' })
      })
    },
  )

  function scrollToBottomInternal() {
    const v = virtualizer.value
    v.measure()
    programmaticScrollCount++
    v.scrollToIndex(messages.value.length - 1, { align: 'end' })
  }

  /**
   * WHAT: Clears all cached measured heights when switching conversations
   *
   * Use case: Different conversations have different message sizes; stale height cache causes incorrect virtual scroll positioning
   * Side effect: measuredHeights.clear()
   */
  watch(currentId, () => {
    measuredHeights.clear()
  })

  /** Scroll virtual list to the last message. If force=false, respects showScrollButton state */
  function scrollToBottom(force = true) {
    if (!force && showScrollButton.value)
      return
    if (messages.value.length === 0)
      return
    scrollToBottomInternal()
    showScrollButton.value = false

    if (force) {
      requestAnimationFrame(() => {
        scrollToBottomInternal()
        showScrollButton.value = false
        suppressUntil = Date.now() + SCROLL_SUPPRESS_MS
      })
    }
  }

  /** Track manual scroll offset to determine whether to show the "scroll to bottom" button */
  function handleScroll() {
    if (programmaticScrollCount > 0) {
      programmaticScrollCount--
      showScrollButton.value = false
      return
    }

    if (Date.now() < suppressUntil)
      return

    const v = virtualizer.value
    const offset = v.scrollOffset ?? 0
    const total = v.getTotalSize()
    const viewport = scrollContainerRef.value?.clientHeight ?? 0

    showScrollButton.value = total - offset - viewport > SCROLL_NEAR_BOTTOM_PX
  }

  /** Measure a real DOM element's rendered height and cache it for future estimateSize calls */
  function measureAndCache(el: unknown, index: number) {
    if (!(el instanceof HTMLElement))
      return
    const msg = messages.value[index]
    if (!msg)
      return
    const prevHeight = measuredHeights.get(msg.id)
    virtualizer.value.measureElement(el)
    if (el.offsetHeight > 0)
      measuredHeights.set(msg.id, el.offsetHeight)
    // Business card actual height may differ from estimate; correct scroll position for last item
    if (index === messages.value.length - 1 && prevHeight && prevHeight !== el.offsetHeight) {
      requestAnimationFrame(() => {
        scrollToBottomInternal()
      })
    }
  }

  /** Force virtualizer to re-measure all items (used after expand/collapse transitions) */
  function triggerRemeasure() {
    virtualizer.value.measure()
  }

  return {
    virtualizer,
    scrollContainerRef,
    showScrollButton,
    scrollToBottom,
    handleScroll,
    triggerRemeasure,
    measureAndCache,
  }
})
