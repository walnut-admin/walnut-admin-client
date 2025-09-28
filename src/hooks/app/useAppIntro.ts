export function useAppIntro(delay = 1500) {
  const { t } = useAppI18n()
  const appStoreSettingDev = useAppStoreSettingDev()

  const { onDrive } = useDriver('app-intro', [
    {
      element: `#${appStoreSettingDev.getMenuId}`,
      popover: {
        title: t('app.intro.sider'),
        description: t('app.intro.sider.detail'),
      },
    },
    {
      element: `#${appStoreSettingDev.getBreadcrumbId}`,
      popover: {

        title: t('app.intro.breadcrumb'),
        description: t('app.intro.breadcrumb.detail'),
      },
    },
    {
      element: '#walnut-fullscreen',
      popover: {

        title: t('app.intro.fullscreen'),
        description: t('app.intro.fullscreen.detail'),
      },
    },
    {
      element: '#walnut-lock',
      popover: {

        title: t('app.intro.lock'),
        description: t('app.intro.lock.detail'),
      },
    },
    {
      element: '#walnut-search',
      popover: {

        title: t('app.intro.search'),
        description: t('app.intro.search.detail'),
      },
    },
    {
      element: '#walnut-locale',
      popover: {

        title: t('app.intro.locale'),
        description: t('app.intro.locale.detail'),
      },
    },
    {
      element: '#walnut-dark',
      popover: {
        title: t('app.intro.dark'),
        description: t('app.intro.dark.detail'),
      },
    },
    {
      element: `#${appStoreSettingDev.getTabsId}`,
      popover: {
        title: t('app.intro.tab'),
        description: t('app.intro.tab.detail'),
      },
    },
    {
      element: '#walnut-settings',
      popover: {

        title: t('app.intro.settings'),
        description: t('app.intro.settings.detail'),
      },
    },
  ])

  const id = setTimeout(() => {
    onDrive()
    clearTimeout(id)
  }, delay)
}
