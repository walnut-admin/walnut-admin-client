import type { BuiltinComponents, UnknownComponents } from '@fingerprintjs/fingerprintjs'
import type { AxiosRequestConfig } from 'axios'
import { enhancedBase64LocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { pick } from 'lodash-es'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

// TODO edge/chrome in same pc has same fingerprint?
const excludeComponents: (keyof BuiltinComponents)[] = [
  'applePay',
  'architecture',
  'audio',
  'audioBaseLatency',
  'canvas',
  'colorDepth',
  'colorGamut',
  'contrast',
  'cookiesEnabled',
  'cpuClass',
  'deviceMemory',
  'domBlockers',
  'fontPreferences',
  'fonts',
  'forcedColors',
  'hardwareConcurrency',
  'hdr',
  'indexedDB',
  'invertedColors',
  'languages',
  'localStorage',
  'math',
  'monochrome',
  'openDatabase',
  'osCpu',
  'pdfViewerEnabled',
  'platform',
  'plugins',
  'privateClickMeasurement',
  'reducedMotion',
  'reducedTransparency',
  'screenFrame',
  'screenResolution',
  'sessionStorage',
  'timezone',
  'touchSupport',
  'vendor',
  'vendorFlavors',
  'webGlBasics',
  'webGlExtensions',
]

const useAppStoreFingerprintInside = defineStore(StoreKeys.APP_FINGERPRINT, {
  state: (): IAppStoreFingerprint => ({
    fingerprint: useAppStorageSync<string>(AppConstPersistKey.FINGERPRINT, '', { storage: enhancedBase64LocalStorage() }),
  }),

  getters: {
    getFingerprint(state) {
      return state.fingerprint!
    },
  },

  actions: {
    async setupFingerprint() {
      if (this.getFingerprint)
        return

      const fpPromise = FingerprintJS.load({})

      // Get the visitor identifier when you need it.
      const fp = await fpPromise
      const result = await fp.get()

      // you can add your custom components here
      const components: UnknownComponents = pick(result.components, excludeComponents)

      const visiterId = FingerprintJS.hashComponents(components)

      this.fingerprint = visiterId
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
