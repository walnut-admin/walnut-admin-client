import type { IStoreApp } from '@/store/types'
import { isEmpty } from 'lodash-es'
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
      getAccountEnabled(state) {
        return +state.auth.account! === 1
      },

      getEmailEnabled(state) {
        return +state.auth.email! === 1
      },

      getPhoneEnabled(state) {
        return +state.auth.phone! === 1
      },

      getQrcodeEnabled(state) {
        return +state.auth.qrcode! === 1
      },

      getGiteeEnabled(state) {
        return +state.auth.gitee! === 1
      },

      getGitHubEnabled(state) {
        return +state.auth.github! === 1
      },

      getFullScreenEnabled(state) {
        return +state.frontend.fullScreen! === 1
      },
      getSearchEnabled(state) {
        return +state.frontend.search! === 1
      },
      getDarkEnabled(state) {
        return +state.frontend.dark! === 1
      },
      getLocaleEnabled(state) {
        return +state.frontend.locale! === 1
      },
    },

    actions: {
      // TODO refactor
      async onInitPublicSettings() {
        if (!isEmpty(this.auth) || !isEmpty(this.frontend)) {
          return
        }

        const res = await getPublicSettingsAPI()

        this.auth = res.auth
        this.frontend = res.frontend
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
