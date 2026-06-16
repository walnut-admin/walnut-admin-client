import { createSharedComposable, useDocumentVisibility } from '@vueuse/core'
import { computed } from 'vue'

export const useSharedDocumentVisibility = createSharedComposable(() => {
  const documentVisibility = useDocumentVisibility()
  return computed(() => documentVisibility.value === 'visible')
})
