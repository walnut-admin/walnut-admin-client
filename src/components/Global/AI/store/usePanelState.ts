import { createGlobalState } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { PANEL_MODES } from '../config/constants'
import { LARGE_PANEL_SIZE, PANEL_SIZE } from '../config/panel'
import { useAIPreferences } from './useAIPreferences'

export const usePanelState = createGlobalState(() => {
  const aiPrefs = useAIPreferences()

  const visible = ref(
    aiPrefs.value.panelMode === 'content-aside' && aiPrefs.value.asidePinned,
  )

  const transitioning = ref(false)

  const isPanelLarge = computed(() => aiPrefs.value.panelMode === 'large-panel')

  const isContentAside = computed(() => aiPrefs.value.panelMode === 'content-aside')

  const panelSize = computed(() =>
    isPanelLarge.value ? LARGE_PANEL_SIZE : PANEL_SIZE,
  )

  const floatingPosition = computed(() => ({
    right: `${aiPrefs.value.panelRight ?? 48}px`,
    bottom: `${aiPrefs.value.panelBottom ?? 20}px`,
  }))

  const panelInnerWidth = computed(() =>
    isContentAside.value ? '100%' : `${panelSize.value.width}px`,
  )

  const panelInnerHeight = computed(() =>
    isContentAside.value ? '100%' : `${panelSize.value.height}px`,
  )

  /**
   * WHAT: Clamps floating panel position within viewport bounds when panel size toggles between normal and large
   *
   * Use case: Switching to large panel could push position off-screen — clamp prevents overflow
   * Side effect: Mutates aiPrefs.panelRight/panelBottom directly
   */
  watch(isPanelLarge, () => {
    const { width: w, height: h } = panelSize.value
    aiPrefs.value.panelRight = Math.max(0, Math.min(aiPrefs.value.panelRight, window.innerWidth - w))
    aiPrefs.value.panelBottom = Math.max(0, Math.min(aiPrefs.value.panelBottom, window.innerHeight - h))
  })

  /** Show the AI panel */
  function open() {
    visible.value = true
  }

  /** Hide the AI panel */
  function close() {
    visible.value = false
  }

  /** Toggle panel visibility */
  function toggle() {
    visible.value = !visible.value
  }

  /** Cycle through panel modes: panel -> large-panel -> content-aside -> panel. Uses View Transition API when transitioning to/from content-aside */
  function cyclePanelMode() {
    if (transitioning.value)
      return
    const idx = PANEL_MODES.indexOf(aiPrefs.value.panelMode)
    const next = PANEL_MODES[(idx + 1) % PANEL_MODES.length]
    const involvesAside = isContentAside.value || next === 'content-aside'

    if (involvesAside && document.startViewTransition) {
      transitioning.value = true
      const vt = document.startViewTransition(async () => {
        aiPrefs.value.panelMode = next
        await nextTick()
      })
      vt.ready.then(() => {
        document.documentElement.animate(
          { opacity: [1, 0] },
          { duration: 500, easing: 'ease', pseudoElement: '::view-transition-old(root)', fill: 'forwards' },
        )
      })
      vt.finished.finally(() => {
        // Delay one frame before re-enabling CSS transitions
        // to prevent catching post-VT layout shifts
        requestAnimationFrame(() => {
          transitioning.value = false
        })
      })
    }
    else {
      aiPrefs.value.panelMode = next
    }
  }

  /**
   * WHAT: Auto-opens the panel when aside pin is toggled on while in content-aside mode
   *
   * Use case: User clicks pin button — panel should become visible to show pinned state
   * Side effect: Calls open() — sets visible = true
   */
  watch(() => aiPrefs.value.asidePinned, (pinned) => {
    if (pinned && isContentAside.value && !visible.value) {
      open()
    }
  })

  return { visible, transitioning, isPanelLarge, isContentAside, panelSize, panelInnerWidth, panelInnerHeight, floatingPosition, open, close, toggle, cyclePanelMode }
})
