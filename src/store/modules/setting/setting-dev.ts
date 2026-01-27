import type { IStoreSetting } from '@/store/types'
import { defineStore } from 'pinia'
import settingsDev from '@/settings-dev.json'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSettingDevInside = defineStore(StoreKeys.SETTING_DEV, {
  state: (): IStoreSetting.Dev => (settingsDev as IStoreSetting.Dev),

  getters: {
    // themes
    getLightThemes(state) {
      return state.themes.light
    },
    getDarkThemes(state) {
      return state.themes.dark
    },

    // app
    getKeepAlive(state) {
      return state.app.keepAlive
    },
    getScrollModeIsContent(state) {
      return state.app.scrollMode === AppConstScrollMode.CONTENT
    },
    getScrollModeIsWrapper(state) {
      return state.app.scrollMode === AppConstScrollMode.WRAPPER
    },
    getContentPadding(state) {
      return state.app.contentPadding
    },

    /**
     * @description get is all layout hidden
     */
    getIsLayoutHidden() {
      return !this.getHeaderShow && !this.getLogoShow && !this.getMenuShow && !this.getTabsShow && !this.getFooterShow
    },

    // logo
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

    // header
    getHeaderId(state) {
      return state.header.id
    },
    getHeaderShow(state) {
      return state.header.status
    },
    getHeaderFixed(state) {
      return state.header.fixed
    },
    getHeaderTransition(state) {
      return state.header.transition
    },
    getHeaderHeight(state) {
      return state.header.status ? state.header.height : 0
    },

    // tabs
    getTabsId(state) {
      return state.tabs.id
    },
    getTabsShow(state) {
      return state.tabs.status
    },
    getTabsFixed(state) {
      return state.tabs.fixed
    },
    getTabsTransition(state) {
      return state.tabs.transition
    },
    getTabsHeight(state) {
      return state.tabs.status ? state.tabs.height : 0
    },
    getTabsItemWidth(state) {
      return state.tabs.status ? state.tabs.itemWidth : 0
    },
    getTabsPersistent(state) {
      return state.tabs.persistent
    },
    getTabsItemTransition(state) {
      return state.tabs.itemTransition
    },
    getTabsScrollUpShow(state) {
      return state.tabs.scrollUpShow
    },
    getTabsLiveOnHover(state) {
      return state.tabs.liveOnHover
    },
    getTabsShowUtils(state) {
      return state.tabs.showUtils
    },
    getTabsUtilsMode(state) {
      return state.tabs.utilsMode
    },
    getTabsContextMenu(state) {
      return state.tabs.contextMenu
    },
    getTabsSortable(state) {
      return state.tabs.sortable
    },

    // breadcrumb
    getBreadcrumbId(state) {
      return state.breadcrumb.id
    },
    getBreadcrumbShow(state) {
      return state.breadcrumb.status
    },
    getBreadcrumbTransition(state) {
      return state.breadcrumb.transition
    },
    getBreadcrumbSeparator(state) {
      return state.breadcrumb.separator
    },

    // menu
    getMenuId(state) {
      return state.menu.id
    },
    getMenuShow(state) {
      return state.menu.status
    },
    getMenuTransition(state) {
      return state.menu.transition
    },
    getMenuIndent(state) {
      return state.menu.indent
    },
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
    getMenuIconSize(state) {
      return state.menu.iconSize
    },
    getMenuCollapsedIconSize(state) {
      return state.menu.collapsedIconSize
    },
    getMenuCollapsedWidth(state) {
      return state.menu.collapsedWidth
    },
    getMenuCollapseStatus(state): boolean {
      return this.getMenuShow && state.menu.collapseStatus
    },
    getMenuAccordion(state) {
      return state.menu.accordion
    },

    /**
     * @description get aside status, pc or mobile
     */
    getMenuAdapterStatus(): boolean {
      const appStoreAdapter = useAppStoreAdapter()
      return !appStoreAdapter.isMobile && (this.getLogoShow || this.getMenuShow)
    },

    /**
     * @description get collapse button status
     */
    getMenuCollapseButtonStatus(): boolean {
      const userStorePreference = useAppStoreUserPreference()

      return (
        this.getMenuCollapseStatus
        && userStorePreference.getMenuCollapseMode === AppConstCollapseMode.BUTTON
      )
    },

    /**
     * @description get collapse icon status
     */
    getMenuCollapseIconStatus(): boolean {
      const userStorePreference = useAppStoreUserPreference()

      return (
        this.getMenuCollapseStatus
        && userStorePreference.getMenuCollapseMode === AppConstCollapseMode.ICON
      )
    },

    /**
     * @description get collapse built-in status
     */
    getMenuCollapseBuiltInStatus(): boolean | 'bar' | 'arrow-circle' {
      const userStorePreference = useAppStoreUserPreference()

      if (
        this.getMenuCollapseStatus
        && userStorePreference.getMenuCollapseMode !== AppConstCollapseMode.ICON
        && userStorePreference.getMenuCollapseMode !== AppConstCollapseMode.BUTTON
      ) {
        return userStorePreference.getMenuCollapseMode
      }

      return false
    },

    // footer
    getFooterId(state) {
      return state.footer.id
    },
    getFooterShow(state) {
      return state.footer.status
    },
    getFooterFixed(state) {
      return state.footer.fixed
    },
    getFooterTransition(state) {
      return state.footer.transition
    },
    getFooterHeight(state) {
      return state.footer.status ? state.footer.height : 0
    },
    getFooterContent(state) {
      return state.footer.content
    },

    // app layout relative
    /**
     * @description get calc main content height
     */
    getCalcContentHeight(): string {
      return `calc(100vh - ${this.getHeaderHeight}rem - ${this.getTabsHeight}rem - ${this.getFooterHeight}rem)`
    },

    /**
     * @description get calc main content height with padding
     */
    getCalcContentHeightWithPadding(): string {
      return `calc(100vh - ${this.getHeaderHeight}rem - ${this.getTabsHeight}rem - ${this.getFooterHeight}rem - ${this.getContentPadding * 2}rem)`
    },

    /**
     * @description get calc main content width
     */
    getCalcContentWidth() {
      return `calc(100vw - ${this.getMenuWidth}rem)`
    },

    /**
     * @description get calc main content width with padding
     */
    getCalcContentWidthWithPadding(): string {
      return `calc(100vw - ${this.getMenuWidth}rem - ${this.getContentPadding * 2}rem)`
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

const useAppStoreSettingDevOutside = () => useAppStoreSettingDevInside(store)

export function useAppStoreSettingDev() {
  if (getCurrentInstance())
    return useAppStoreSettingDevInside()
  return useAppStoreSettingDevOutside()
}
