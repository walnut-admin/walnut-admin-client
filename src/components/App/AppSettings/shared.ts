import { getMergedTheme } from '@/App/src/naive/src/theme'

const userStorePreference = useAppStoreUserPreference()
const isReducedMotion = useSharedPreferredReducedMotion()

export const modalColor = computed(
  () => getMergedTheme.value?.Drawer.common?.modalColor as string,
)

export const getCanAnimate = computed(
  () => isReducedMotion.value && userStorePreference.getReducedMotion as boolean,
)
