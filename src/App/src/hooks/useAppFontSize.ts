export function useAppFontSize() {
  const userStorePreference = useAppStoreUserPreference()

  watch(
    () => userStorePreference.getFontSize,
    (v) => {
      document.documentElement.style.fontSize = `${v}px`
    },
    {
      immediate: true,
    },
  )
}
