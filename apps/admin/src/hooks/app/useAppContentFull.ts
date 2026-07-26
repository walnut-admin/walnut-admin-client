export function useAppContentFull() {
  const appStoreSettingDev = useAppStoreSettingDev()
  const full = useRouterQuery('full')

  watchEffect(() => {
    if (full.value)
      appStoreSettingDev.toggleLayout(false)
  })
}
