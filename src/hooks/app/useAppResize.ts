export function useAppResize() {
  const appStoreAdapter = useAppStoreAdapter()
  const appStoreMenu = useAppStoreMenu()

  const breakpoints = useAppBreakpoints()

  const handler = () => {
    if (breakpoints.isSmaller('sm')) {
      // when mobile
      // 1.isMobile => true
      // 2.device => 'mobile'
      // 3.no more collapse
      // 4.mobile only show `left-menu` layout

      appStoreAdapter.setDevice(AppConstDevice.MOBILE)
      appStoreMenu.setCollapse(false)
      // appSetting.settings.app.layout = AppConstLayoutMode.LEFT_MENU
    }

    if (breakpoints.isInBetween('sm', 'lg')) {
      // when tablet
      // 1.isMobile => false
      // 2.device => 'tablet'
      // 3.auto collapse

      appStoreAdapter.setDevice(AppConstDevice.TABLET)
      appStoreMenu.setCollapse(true)
    }

    if (breakpoints.isInBetween('lg', 'xl')) {
      // when laptop
      // 1.isMobile => false
      // 2.device => 'laptop'
      // 3.no collapse

      appStoreAdapter.setDevice(AppConstDevice.LAPTOP)
      appStoreMenu.setCollapse(false)
    }

    if (breakpoints.isGreater('xl')) {
      // when desktop
      // 1.isMobile => false
      // 2.device => 'desktop'
      // 3.no collapse

      appStoreAdapter.setDevice(AppConstDevice.DESKTOP)
      appStoreMenu.setCollapse(false)
    }
  }

  useWindowResize(handler)

  tryOnBeforeMount(() => handler())
}
