export function useAppColorMode() {
  const userStorePreference = useAppStoreUserPreference()
  const appColorMode = useSharedColorMode()

  watch(
    () => userStorePreference.getColorMode,
    (v) => {
      appColorMode.value = v
    },
    {
      immediate: true,
    },
  )
}
