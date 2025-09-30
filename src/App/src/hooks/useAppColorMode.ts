const useSharedColorMode = createSharedComposable(() => {
  const modes = Object.fromEntries(
    Object.values(AppConstColorMode).map(i => [i, i]),
  )

  return useColorMode({
    modes,
    attribute: 'color-mode',
  })
})

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
