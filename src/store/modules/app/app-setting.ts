import type {
  AppSettingsForApp,
  AppSettingsForBreadcrumb,
  AppSettingsForFooter,
  AppSettingsForHeader,
  AppSettingsForLogo,
  AppSettingsForMenu,
  AppSettingsForTabs,
  AppSettingsForTheme,
} from '~/settings'
import { defineStore } from 'pinia'
import settings from '@/settings.json'
import { StoreKeys } from '../../constant'

import { store } from '../../pinia'

const useAppStoreSettingInside = defineStore(StoreKeys.APP_SETTING, {
  state: (): AppSettings => ({
    themes: settings.themes as AppSettingsForTheme,

    app: settings.app as AppSettingsForApp,

    logo: settings.logo as AppSettingsForLogo,

    header: settings.header as AppSettingsForHeader,

    tabs: settings.tabs as AppSettingsForTabs,

    breadcrumb: settings.breadcrumb as AppSettingsForBreadcrumb,

    menu: settings.menu as AppSettingsForMenu,

    footer: settings.footer as AppSettingsForFooter,
  }),

  getters: {
    // app
    getTransition(state): ValueOfAppConstTransitionName | null {
      const { currentRoute } = useAppRouter()

      const setting = state.app

      if (setting.transitionStatus) {
        if (setting.transitionMode === AppConstBasicMode.GLOBAL) {
          return setting.transitionName
        }
        else {
          return (
            currentRoute.value.meta?.animationName
            || AppConstTransitionName.FADE
          ) as ValueOfAppConstTransitionName
        }
      }

      return null
    },

    getShowGlobalWatermark(state) {
      return (
        state.app.watermarkStatus
        && state.app.watermarkMode === AppConstBasicMode.GLOBAL
      )
    },

    getAsideMenuStatus(): boolean {
      return this.getLogoShow && this.getMenuShow
    },

    getLockStatus(state) {
      return state.app.lockStatus
    },

    getScrollModeIsContent(state) {
      return state.app.scrollMode === AppConstScrollMode.CONTENT
    },

    getScrollModeIsWrapper(state) {
      return state.app.scrollMode === AppConstScrollMode.WRAPPER
    },

    // Logo
    getLogoId(state) {
      return state.logo.id
    },

    getLogoShow(state) {
      return state.logo.status
    },

    getLogoFixed(state) {
      return state.logo.fixed
    },

    getLogoTransition(state) {
      return state.logo.transition
    },

    // Headers
    getHeaderId(state) {
      return state.header.id
    },

    getHeaderShow(state) {
      return state.header.status
    },

    getHeaderFixed(state) {
      return state.header.fixed
    },

    getHeaderInverted(state) {
      return state.header.inverted
    },

    getHeaderTransition(state) {
      return state.header.transition
    },

    getHeaderHeight(state) {
      return state.header.status ? state.header.height : 0
    },

    // Breadcrumb
    getBreadcrumbId(state) {
      return state.breadcrumb.id
    },

    getBreadcrumbShow(state) {
      return state.breadcrumb.status
    },

    getBreadcrumbTransition(state) {
      return state.breadcrumb.transition
    },

    // Tabs
    getTabsId(state) {
      return state.tabs.id
    },

    getTabsShow(state) {
      return state.tabs.status
    },

    getTabsFixed(state) {
      return state.tabs.fixed
    },

    getTabsInverted(state) {
      return state.tabs.inverted
    },

    getTabsTrasition(state) {
      return state.tabs.transition
    },

    getTabsHeight(state) {
      return state.tabs.status ? state.tabs.height : 0
    },

    // Footer
    getFooterId(state) {
      return state.footer.id
    },

    getFooterShow(state) {
      return state.footer.status
    },

    getFooterFixed(state) {
      return state.footer.fixed
    },

    getFooterInverted(state) {
      return state.footer.inverted
    },

    getFooterTransition(state) {
      return state.footer.transition
    },

    getFooterHeight(state) {
      return state.footer.status ? state.footer.height : 0
    },

    // Menu
    getMenuId(state) {
      return state.menu.id
    },

    getMenuShow(state) {
      return state.menu.status
    },

    getMenuInverted(state) {
      return state.menu.inverted
    },

    getMenuTransition(state) {
      return state.menu.transition
    },

    getMenuCollapseMode(state) {
      return state.menu.collapseMode
    },

    getMenuCollapseStatus(state): boolean {
      return this.getMenuShow && state.menu.collapseStatus
    },

    getMenuCollapseButtonStatus(): boolean {
      return (
        this.getMenuCollapseStatus
        && this.getMenuCollapseMode === AppConstCollapseMode.BUTTON
      )
    },

    getMenuCollapseIconStatus(): boolean {
      return (
        this.getMenuCollapseStatus
        && this.getMenuCollapseMode === AppConstCollapseMode.ICON
      )
    },

    getMenuCollapseBuiltInStatus(): boolean | 'bar' | 'arrow-circle' {
      if (
        this.getMenuCollapseStatus
        && this.getMenuCollapseMode !== AppConstCollapseMode.ICON
        && this.getMenuCollapseMode !== AppConstCollapseMode.BUTTON
      ) {
        return this.getMenuCollapseMode
      }

      return false
    },

    /**
     * @description get aside status, pc or mobile
     */
    getMenuAdapterStatus(): boolean {
      const appStoreAdapter = useAppStoreAdapter()
      return !appStoreAdapter.isMobile && (this.getLogoShow || this.getMenuShow)
    },

    /**
     * @description get is all layout hidden
     */
    getIsLayoutHidden(): boolean {
      return !this.header.status && !this.logo.status && !this.menu.status && !this.tabs.status && !this.footer.status
    },

    /**
     * @description get aside menu width based on menu config
     */
    getMenuWidth(state) {
      const appStoreMenu = useAppStoreMenu()
      const appStoreAdapter = useAppStoreAdapter()

      if (appStoreAdapter.isMobile) {
        return 0
      }

      if (state.menu.status && !appStoreMenu.getCollapse) {
        return state.menu.width
      }

      if (state.menu.status && appStoreMenu.getCollapse) {
        return state.menu.collapsedWidth
      }

      return 0
    },

    /**
     * @description get calc main content height
     */
    getCalcContentHeight(): string {
      return `calc(100vh - ${this.getHeaderHeight}px - ${this.getTabsHeight}px - ${this.getFooterHeight}px)`
    },

    /**
     * @description get calc main content height with padding
     */
    getCalcContentHeightWithPadding(): string {
      return `calc(100vh - ${this.getHeaderHeight}px - ${this.getTabsHeight}px - ${this.getFooterHeight}px - ${this.app.contentPadding * 2}px)`
    },

    /**
     * @description get calc main content width
     */
    getCalcContentWidth() {
      return `calc(100vw - ${this.getMenuWidth}px)`
    },

    /**
     * @description get calc main content width with padding
     */
    getCalcContentWidthWithPadding(): string {
      return `calc(100vw - ${this.getMenuWidth}px - ${this.app.contentPadding * 2}px)`
    },
  },

  actions: {
    toggleLayout(val: boolean) {
      this.header.status = val
      this.logo.status = val
      this.menu.status = val
      this.tabs.status = val
      this.footer.status = val
    },
  },
})

const useAppStoreSettingOutside = () => useAppStoreSettingInside(store)

export function useAppStoreSetting() {
  if (getCurrentInstance())
    return useAppStoreSettingInside()
  return useAppStoreSettingOutside()
}
