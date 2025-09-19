import type { IStoreSetting } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSettingDevInside = defineStore(StoreKeys.SETTING_DEV, {
  state: (): IStoreSetting.Dev => ({
    app: {
      keepAlive: true,
      scrollMode: AppConstScrollMode.WRAPPER,
      contentPadding: 4,
    },
    logo: {
      id: 'walnut-admin-logo',
      status: true,
      fixed: true,
      transition: AppConstTransitionName.SLIDE_LEFT,
    },
    header: {
      id: 'walnut-admin-header',
      status: true,
      fixed: true,
      transition: AppConstTransitionName.SLIDE_UP,
      height: 48,
      scrollUpShow: false,
      liveOnHover: false,
    },
    tabs: {
      id: 'walnut-admin-tabs',
      status: true,
      fixed: true,
      height: 36,
      itemWidth: 120,
      transition: AppConstTransitionName.SLIDE_UP,
      persistent: true,
      itemTransition: AppConstTransitionName.FADE_DOWN,
      scrollUpShow: false,
      liveOnHover: false,
      showUtils: true,
      utilsMode: AppConstTabUtilsShowMode.OVERFLOW,
      contextMenu: true,
      sortable: true,
    },
    breadcrumb: {
      id: 'walnut-admin-breadcrumb',
      status: true,
      transition: AppConstTransitionName.FADE_DOWN,
      separator: '>',
    },
    menu: {
      id: 'walnut-admin-menu',
      status: true,
      transition: AppConstTransitionName.SLIDE_LEFT,
      indent: 16,
      width: 240,
      iconSize: 24,
      collapsedIconSize: 20,
      collapsedWidth: 64,
      collapseStatus: true,
      accordion: true,
    },
    footer: {
      id: 'walnut-admin-footer',
      status: true,
      fixed: true,
      height: 28,
      transition: AppConstTransitionName.SLIDE_DOWN,
      content: 'Copyright © 2020-present Walnut Admin. All Rights Reserved.',
    },
  }),

  getters: {},

  actions: {},
})

const useAppStoreSettingDevOutside = () => useAppStoreSettingDevInside(store)

export function useAppStoreSettingDev() {
  if (getCurrentInstance())
    return useAppStoreSettingDevInside()
  return useAppStoreSettingDevOutside()
}
