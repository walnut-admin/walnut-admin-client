import type { AxiosRequestConfig } from 'axios'
import type { IStoreApp } from '@/store/types'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { defineStore } from 'pinia'
import { enhancedBase64LocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { detectDeviceType } from '@/utils/shared'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreFingerprintInside = defineStore(StoreKeys.APP_FINGERPRINT, {
  state: (): IStoreApp.Fingerprint => ({
    fingerprint: useAppStorageSync<string>(AppConstPersistKey.FINGERPRINT, '', { storage: enhancedBase64LocalStorage() }),
  }),

  getters: {
    getFingerprint(state) {
      return state.fingerprint!
    },
    getDeviceNameFromFingerprint(state) {
      return `${detectDeviceType()}_${state.fingerprint?.slice(0, 6)}`.toLocaleUpperCase()
    },
  },

  actions: {
    async setupFingerprint() {
      if (this.getFingerprint)
        return
      const fpPromise = FingerprintJS.load({})
      const fp = await fpPromise
      const result = await fp.get()
      this.fingerprint = result.visitorId
    },

    axiosReqInterceptorBuildFingerprint(_config: AxiosRequestConfig) {
      return this.getFingerprint
    },
  },
})

const useAppStoreFingerprintOutside = () => useAppStoreFingerprintInside(store)

export function useAppStoreFingerprint() {
  if (getCurrentInstance())
    return useAppStoreFingerprintInside()
  return useAppStoreFingerprintOutside()
}
