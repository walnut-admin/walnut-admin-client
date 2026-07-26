import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { getPublicSettingsAPI } from '@/api/app/setting'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSettingBackendInside = defineStore(
  StoreKeys.APP_SETTING_BACKEND,
  {
    state: (): IStoreApp.SettingBackend => ({
      auth: {},
      frontend: {},
    }),

    getters: {
      getEmailEnabled(state) {
        return state.auth.email
      },

      getPhoneEnabled(state) {
        return state.auth.phone
      },

      getQrcodeEnabled(state) {
        return state.auth.qrcode
      },

      getGiteeEnabled(state) {
        return state.auth.gitee
      },

      getGitHubEnabled(state) {
        return state.auth.github
      },

      getGoogleEnabled(state) {
        return state.auth.google
      },

      getOpaqueEnabled(state) {
        return state.auth.opaque?.enable ?? false
      },

      // TODO need register form
      getOpaqueRegisterEnabled(state) {
        return state.auth.opaque?.register ?? false
      },

      getOpaqueForgetEnabled(state) {
        return state.auth.opaque?.forget ?? false
      },

      getFullScreenEnabled(state) {
        return state.frontend.fullScreen
      },
      getSearchEnabled(state) {
        return state.frontend.search
      },
      getDarkEnabled(state) {
        return state.frontend.dark
      },
      getLocaleEnabled(state) {
        return state.frontend.locale
      },
    },

    actions: {
      async onInitPublicSettings() {
        const res = await getPublicSettingsAPI()
        this.$patch(res)
      },
    },
  },
)

function useAppStoreSettingBackendOutside() {
  return useAppStoreSettingBackendInside(store)
}

export function useAppStoreSettingBackend() {
  if (getCurrentInstance())
    return useAppStoreSettingBackendInside()
  return useAppStoreSettingBackendOutside()
}
