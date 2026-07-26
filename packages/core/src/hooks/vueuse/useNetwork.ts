import { createSharedComposable, useNetwork } from '@vueuse/core'

export const useSharedNetwork = createSharedComposable(useNetwork)
