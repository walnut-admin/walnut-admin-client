export function useAppCvdMode() {
  const userStorePreference = useAppStoreUserPreference()

  watch(
    () => userStorePreference.getCVD,
    (v) => {
      document.documentElement.setAttribute('cvd-mode', v)
    },
    {
      immediate: true,
    },
  )
}
