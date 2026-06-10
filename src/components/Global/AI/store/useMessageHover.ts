import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useMessageHover = createGlobalState(() => {
  const hoveredId = ref<string | null>(null)

  function onEnter(id: string) {
    hoveredId.value = id
  }
  function onLeave() {
    hoveredId.value = null
  }
  function isHovered(id: string) {
    return hoveredId.value === id
  }

  return { onEnter, onLeave, isHovered }
})
