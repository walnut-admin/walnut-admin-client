import type { IStoreUser } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreUserPreferenceInside = defineStore(StoreKeys.USER_PREFERENCE, {
  state: (): IStoreUser.Preference => ({
    app: {
      locale: AppConstLocale.EN_US,
      isDark: false,
      reducedMotion: false,
      colorMode: AppConstColorMode.DEFAULT,
      layout: AppConstLayoutMode.LEFT_MENU,
    },
    themes: {
      light: {
        primaryColor: '#18a058',
        infoColor: '#2080f0',
        successColor: '#18a058',
        warningColor: '#f0a020',
        errorColor: '#d03050',
        bodyColor: '#f8f8f8',
        invertedColor: '#2C3E50',
      },
      dark: {
        primaryColor: '#63e2b7',
        infoColor: '#70c0e8',
        successColor: '#63e2b7',
        warningColor: '#f2c97d',
        errorColor: '#e88080',
        bodyColor: '#202020',
        invertedColor: '#2C3E50',
      },
    },
    header: {
      inverted: true,
    },
    tabs: {
      inverted: true,
      showIcon: true,
      styleMode: AppConstTabStyleMode.CARD,
      closeMode: AppConstTabCloseMode.HOVER,
      affixMode: AppConstTabAffixMode.ICON,
    },
    breadcrumb: {
      showIcon: true,
      showDropdown: true,
    },
    menu: {
      inverted: true,
      collapseMode: AppConstCollapseMode.BAR,
    },
    footer: {
      inverted: true,
    },
  }),

  getters: {
    // app
    getLocale(state) {
      return state.app.locale
    },
    getIsDark(state): boolean {
      return state.app.isDark
    },
    getReducedMotion(state): boolean {
      return state.app.reducedMotion
    },
    getColorMode(state) {
      return state.app.colorMode
    },
    getLayout(state) {
      return state.app.layout
    },

    // themes
    getDarkTheme(state) {
      return state.themes.dark
    },
    getLightTheme(state) {
      return state.themes.light
    },

    // header
    getHeaderInverted(state): boolean {
      return state.header.inverted
    },

    // tabs
    getTabsInverted(state): boolean {
      return state.tabs.inverted
    },
    getTabsShowIcon(state): boolean {
      return state.tabs.showIcon
    },
    getTabsStyleMode(state) {
      return state.tabs.styleMode
    },
    getTabsCloseMode(state) {
      return state.tabs.closeMode
    },
    getTabsAffixMode(state) {
      return state.tabs.affixMode
    },
    // breadcrumb
    getBreadcrumbShowIcon(state): boolean {
      return state.breadcrumb.showIcon
    },
    getBreadcrumbShowDropdown(state): boolean {
      return state.breadcrumb.showDropdown
    },
    // menu
    getMenuInverted(state): boolean {
      return state.menu.inverted
    },
    getMenuCollapseMode(state) {
      return state.menu.collapseMode
    },
    // footer
    getFooterInverted(state): boolean {
      return state.footer.inverted
    },
  },

  actions: {},
})

const useAppStoreUserPreferenceOutside = () => useAppStoreUserPreferenceInside(store)

export function useAppStoreUserPreference() {
  if (getCurrentInstance())
    return useAppStoreUserPreferenceInside()
  return useAppStoreUserPreferenceOutside()
}
