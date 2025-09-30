export function useAppLocale() {
  const userStorePreference = useAppStoreUserPreference()
  const appStoreLocale = useAppStoreLocale()

  watch(
    () => userStorePreference.getLocale,
    (v) => {
      appStoreLocale.onLoadMessageCache(v)
    },
    {
      immediate: true,
    },
  )
}
