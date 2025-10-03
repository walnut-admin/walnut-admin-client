import type { IStoreUser } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreUserPreferenceInside = defineStore(StoreKeys.USER_PREFERENCE, {
  state: (): IStoreUser.Preference.State => ({
    basic: {
      locale: AppConstLocale.ZH_CN,
    },
    accessibility: {
      fontSize: 14,
      reducedMotion: false,
      colorMode: AppConstColorMode.DEFAULT,
    },
    theme: {
      dark: false,
    },
    layout: {
      layoutMode: AppConstLayoutMode.LEFT_MENU,
      layout: {
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
      },
    },
  }),

  getters: {
    // app
    getFontSize(state) {
      return state.accessibility.fontSize
    },
    getLocale(state) {
      return state.basic.locale
    },
    getIsDark(state): boolean {
      return state.theme.dark
    },
    getReducedMotion(state): boolean {
      return state.accessibility.reducedMotion
    },
    getColorMode(state) {
      return state.accessibility.colorMode
    },
    getLayout(state) {
      return state.layout.layout
    },

    // themes
    getDarkTheme(_state) {
      return {
        primaryColor: '#63e2b7',
        infoColor: '#70c0e8',
        successColor: '#63e2b7',
        warningColor: '#f2c97d',
        errorColor: '#e88080',
        bodyColor: '#202020',
        invertedColor: '#2C3E50',
      }
    },
    getLightTheme(_state) {
      return {
        primaryColor: '#18a058',
        infoColor: '#2080f0',
        successColor: '#18a058',
        warningColor: '#f0a020',
        errorColor: '#d03050',
        bodyColor: '#f8f8f8',
        invertedColor: '#2C3E50',
      }
    },

    // header
    getHeaderInverted(state): boolean {
      return state.layout.layout.header.inverted
    },

    // tabs
    getTabsInverted(state): boolean {
      return state.layout.layout.tabs.inverted
    },
    getTabsShowIcon(state): boolean {
      return state.layout.layout.tabs.showIcon
    },
    getTabsStyleMode(state) {
      return state.layout.layout.tabs.styleMode
    },
    getTabsCloseMode(state) {
      return state.layout.layout.tabs.closeMode
    },
    getTabsAffixMode(state) {
      return state.layout.layout.tabs.affixMode
    },
    // breadcrumb
    getBreadcrumbShowIcon(state): boolean {
      return state.layout.layout.breadcrumb.showIcon
    },
    getBreadcrumbShowDropdown(state): boolean {
      return state.layout.layout.breadcrumb.showDropdown
    },
    // menu
    getMenuInverted(state): boolean {
      return state.layout.layout.menu.inverted
    },
    getMenuCollapseMode(state) {
      return state.layout.layout.menu.collapseMode
    },
    // footer
    getFooterInverted(state): boolean {
      return state.layout.layout.footer.inverted
    },
  },

  actions: {
    setPreference(payload: IStoreUser.Preference.State) {
      this.$patch(payload)
    },

    setLayout(payload: IStoreUser.Preference.Layout) {
      this.layout = payload
    },
  },
})

const useAppStoreUserPreferenceOutside = () => useAppStoreUserPreferenceInside(store)

export function useAppStoreUserPreference() {
  if (getCurrentInstance())
    return useAppStoreUserPreferenceInside()
  return useAppStoreUserPreferenceOutside()
}
