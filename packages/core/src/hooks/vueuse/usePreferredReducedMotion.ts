import { createSharedComposable, usePreferredReducedMotion } from '@vueuse/core'
import { computed } from 'vue'

export const useSharedPreferredReducedMotion = createSharedComposable(() => {
  const reducedMotion = usePreferredReducedMotion()
  return computed(() => reducedMotion.value === 'reduce')
})
