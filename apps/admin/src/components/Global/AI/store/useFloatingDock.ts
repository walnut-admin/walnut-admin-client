import { createGlobalState } from '@vueuse/core'
import { computed, onBeforeUnmount, ref } from 'vue'
import { DOCK_CLAMP_MARGIN_PCT, DOCK_DRAG_CLICK_THRESHOLD_PCT, DOCK_TRIGGER_HEIGHT_PX } from '../config/constants'
import { useAIPreferences } from './useAIPreferences'
import { usePanelState } from './usePanelState'

export const useFloatingDock = createGlobalState(() => {
  const aiPrefs = useAIPreferences()
  const { open } = usePanelState()

  const isDragging = ref(false)
  let dragStartY = 0
  let dragStartTriggerY = 0
  let userSelectLocked = false

  /** Clamp dock vertical position (0-100%) with margin, accounting for trigger height */
  function clampY(y: number): number {
    const margin = DOCK_CLAMP_MARGIN_PCT
    const heightPct = (DOCK_TRIGGER_HEIGHT_PX / window.innerHeight) * 100
    const maxY = Math.round(100 - margin - heightPct)
    return Math.max(margin, Math.min(maxY, Math.round(y)))
  }

  function lockUserSelect() {
    if (!userSelectLocked) {
      document.body.style.userSelect = 'none'
      userSelectLocked = true
    }
  }

  function unlockUserSelect() {
    if (userSelectLocked) {
      document.body.style.userSelect = ''
      userSelectLocked = false
    }
  }

  onBeforeUnmount(() => {
    unlockUserSelect()
  })

  /** Begin dragging the dock trigger; capture pointer and disable text selection */
  function onPointerDown(e: PointerEvent) {
    isDragging.value = true
    dragStartY = e.clientY
    dragStartTriggerY = aiPrefs.value.dockY

    const el = e.currentTarget as HTMLElement
    if (el?.setPointerCapture) {
      el.setPointerCapture(e.pointerId)
    }
    lockUserSelect()
  }

  /** Update dock Y position based on pointer delta during drag */
  function onPointerMove(e: PointerEvent) {
    if (!isDragging.value)
      return
    const dy = (e.clientY - dragStartY) / window.innerHeight * 100
    aiPrefs.value.dockY = clampY(dragStartTriggerY + dy)
  }

  /** End drag; if barely moved (<0.5%), treat as a click and open the panel */
  function onPointerUp(_e: PointerEvent) {
    if (!isDragging.value)
      return
    isDragging.value = false

    const moved = Math.abs(aiPrefs.value.dockY - dragStartTriggerY)
    if (moved < DOCK_DRAG_CLICK_THRESHOLD_PCT)
      open()

    unlockUserSelect()
  }

  /** Cancel drag (e.g. pointer lost); restore text selection */
  function onPointerCancel() {
    if (!isDragging.value)
      return
    isDragging.value = false
    unlockUserSelect()
  }

  const triggerStyle = computed(() => ({
    top: `${aiPrefs.value.dockY}%`,
    right: '0',
  }))

  return { isDragging, triggerStyle, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
})
