import { onBeforeUnmount, ref } from 'vue'
import { CONTENT_ASIDE_THRESHOLD } from '../config/panel'
import { useAIPreferences } from '../store/useAIPreferences'

export function useResizableWidth() {
  const aiPrefs = useAIPreferences()
  const isResizing = ref(false)
  let startX = 0
  let startWidth = 0

  function onPointerMove(e: PointerEvent) {
    if (!isResizing.value)
      return
    const delta = startX - e.clientX
    aiPrefs.value.asideWidth = Math.min(CONTENT_ASIDE_THRESHOLD.max, Math.max(CONTENT_ASIDE_THRESHOLD.min, startWidth + delta))
  }

  function cleanup() {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', cleanup)
  }

  function onPointerUp() {
    isResizing.value = false
    cleanup()
  }

  function onPointerDown(e: PointerEvent) {
    isResizing.value = true
    startX = e.clientX
    startWidth = aiPrefs.value.asideWidth
    e.preventDefault()
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  onBeforeUnmount(() => {
    cleanup()
  })

  return { isResizing, onPointerDown }
}
