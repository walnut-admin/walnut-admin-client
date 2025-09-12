export function useAppContentFull() {
  const appSetting = useAppStoreSetting()
  const full = useRouterQuery('full')

  watchEffect(() => {
    if (full.value)
      appSetting.toggleLayout(false)
  })
}
