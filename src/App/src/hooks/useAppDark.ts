export function useAppDark() {
  const userStorePreference = useAppStoreUserPreference()

  watch(
    () => userStorePreference.getIsDark,
    (v) => {
      isDark.value = v
    },
    {
      immediate: true,
    },
  )
}
