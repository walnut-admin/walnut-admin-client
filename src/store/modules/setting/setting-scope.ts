import type { WatermarkProps } from 'naive-ui'
import type { RouteLocationNormalized } from 'vue-router'
import type { ValueOfAppConstTransitionName } from '@/const'
import type { IStoreSetting } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSettingScopeInside = defineStore(StoreKeys.SETTING_SCOPE, {
  state: (): IStoreSetting.Scope => ({
    hijackRefresh: {
      status: true,
      mode: AppConstBasicMode.GLOBAL,
      hijack: true,
    },
    watermark: {
      status: true,
      mode: AppConstBasicMode.GLOBAL,
      config: {
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
      name: AppConstTransitionName.FADE,
    },
  }),

  getters: {
    getHijackRefreshStatus: state => state.hijackRefresh.status,
    getHijackRefresh: (state) => {
      return (route: RouteLocationNormalized): boolean | undefined => {
        if (state.hijackRefresh.mode === AppConstBasicMode.GLOBAL)
          return true

        if (state.hijackRefresh.mode === AppConstBasicMode.SCOPE) {
          return route.meta?.hijackRefresh ?? false
        }
      }
    },

    getWatermarkStatus: state => state.watermark.status,
    getWatermarkConfig: (state) => {
      return (route: RouteLocationNormalized): WatermarkProps | undefined => {
        if (state.watermark.mode === AppConstBasicMode.GLOBAL)
          return state.watermark.config

        if (state.watermark.mode === AppConstBasicMode.SCOPE) {
          return route.meta?.watermark ?? state.watermark.config
        }
      }
    },

    getTransitionStatus: state => state.transition.status,
    getTransitionName: (state) => {
      return (route: RouteLocationNormalized): ValueOfAppConstTransitionName | undefined => {
        if (state.watermark.mode === AppConstBasicMode.GLOBAL)
          return state.transition.name

        if (state.transition.mode === AppConstBasicMode.SCOPE) {
          return route.meta?.transitionName ?? state.transition.name
        }
      }
    },
  },

  actions: {},
})

const useAppStoreSettingScopeOutside = () => useAppStoreSettingScopeInside(store)

export function useAppStoreSettingScope() {
  if (getCurrentInstance())
    return useAppStoreSettingScopeInside()
  return useAppStoreSettingScopeOutside()
}
