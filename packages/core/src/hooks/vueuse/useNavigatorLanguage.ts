import { createSharedComposable, useNavigatorLanguage } from '@vueuse/core'

export const useSharedNavigatorLanguage = createSharedComposable(useNavigatorLanguage)
