import type { WatermarkProps } from 'naive-ui'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import type { ValueOfAppConstTransitionName } from '@/const'
import type { IStoreSetting } from '@/store/types'
import { defineStore } from 'pinia'
import { getPrivateSettingsAPI } from '@/api/app/setting'
import { patchRouter } from '@/router/utils/patch'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSettingScopeInside = defineStore(StoreKeys.SETTING_SCOPE, {
  state: (): IStoreSetting.Scope => ({
    initialized: false,
    maskUrl: {
      status: true,
      mode: AppConstBasicMode.GLOBAL,
      value: true,
    },
    hijackRefresh: {
      status: true,
      mode: AppConstBasicMode.GLOBAL,
      value: true,
    },
    watermark: {
      status: true,
      mode: AppConstBasicMode.GLOBAL,
      value: {
        content: 'Walnut Admin',
        cross: true,
        fullscreen: true,
        fontSize: 16,
        lineHeight: 16,
        width: 196,
        height: 196,
        rotate: -15,
        xOffset: 12,
        yOffset: 60,
        zIndex: 99999,
      },
    },
    transition: {
      status: true,
      mode: AppConstBasicMode.GLOBAL,
      value: AppConstTransitionName.FADE,
    },
  }),

  getters: {
    getMaskUrlStatus: state => state.maskUrl.status,
    getMaskUrlValue: (state) => {
      return (route: RouteRecordRaw | RouteLocationNormalized): boolean | undefined => {
        if (state.maskUrl.mode === AppConstBasicMode.GLOBAL)
          return state.maskUrl.value

        if (state.maskUrl.mode === AppConstBasicMode.SCOPE) {
          return route?.meta?.maskUrl ?? false
        }
      }
    },

    getHijackRefreshStatus: state => state.hijackRefresh.status,
    getHijackRefresh: (state) => {
      return (route: RouteLocationNormalized): boolean | undefined => {
        if (state.hijackRefresh.mode === AppConstBasicMode.GLOBAL)
          return state.hijackRefresh.value

        if (state.hijackRefresh.mode === AppConstBasicMode.SCOPE) {
          return route?.meta?.hijackRefresh ?? false
        }
      }
    },

    getWatermarkStatus: state => state.watermark.status,
    getWatermarkConfig: (state) => {
      return (route: RouteLocationNormalized): WatermarkProps | undefined => {
        if (state.watermark.mode === AppConstBasicMode.GLOBAL)
          return state.watermark.value

        if (state.watermark.mode === AppConstBasicMode.SCOPE) {
          return route?.meta?.watermark ?? {}
        }
      }
    },

    getTransitionStatus: state => state.transition.status,
    getTransitionName: (state) => {
      return (route: RouteLocationNormalized): ValueOfAppConstTransitionName | undefined => {
        if (state.transition.mode === AppConstBasicMode.GLOBAL)
          return state.transition.value

        if (state.transition.mode === AppConstBasicMode.SCOPE) {
          return route?.meta?.transition ?? state.transition.value
        }
      }
    },
  },

  actions: {
    getRouterEnhanceWhiteListCondition(route: RouteLocationNormalized) {
      const appStoreRoute = useAppStoreRoute()
      if (appStoreRoute.isPathInWhiteList(route.path))
        return true
      return !this.getMaskUrlStatus || !this.getMaskUrlValue(route)
    },

    async onInitPrivateSettings() {
      if (this.initialized)
        return

      this.initialized = true
      const res = await getPrivateSettingsAPI()
      this.$patch(res)
      patchRouter(AppRouter)
    },
  },
})

const useAppStoreSettingScopeOutside = () => useAppStoreSettingScopeInside(store)

export function useAppStoreSettingScope() {
  if (getCurrentInstance())
    return useAppStoreSettingScopeInside()
  return useAppStoreSettingScopeOutside()
}
