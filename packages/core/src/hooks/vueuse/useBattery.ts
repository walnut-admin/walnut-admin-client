import { createSharedComposable, useBattery } from '@vueuse/core'

export const useSharedBattery = createSharedComposable(useBattery)
