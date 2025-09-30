export function useAppReducedMotion() {
  const userStorePreference = useAppStoreUserPreference()
  const isReducedMotion = useSharedPreferredReducedMotion()

  watch(
    () => userStorePreference.getReducedMotion,
    (v) => {
      document.documentElement.setAttribute('reduced-motion', `${v}`)
    },
    {
      immediate: true,
    },
  )

  watchEffect(() => {
    userStorePreference.accessibility.reducedMotion = isReducedMotion.value
  })
}
