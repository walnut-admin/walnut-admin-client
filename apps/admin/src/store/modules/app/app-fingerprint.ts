import type { UnknownComponents } from '@fingerprintjs/fingerprintjs'
import type { AxiosRequestConfig } from 'axios'
import type { IStoreApp } from '@/store/types'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { defineStore } from 'pinia'
import { enhancedBase64LocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { detectDeviceType } from '@/utils/shared'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

// get storage component
async function getStorageComponent() {
  const features = []

  try {
    // Chrome/Edge/Safari 支持：无痕模式 quota 通常 < 200MB，正常模式 > 10GB
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const est = await navigator.storage.estimate()
      const quota = est.quota || 0

      // 将配额分级作为特征（避免精确数值的噪音）
      if (quota === 0)
        features.push('quota:none')
      else if (quota < 150000000)
        features.push('quota:low') // <150MB → 大概率无痕
      else if (quota < 1000000000)
        features.push('quota:medium')
      else features.push('quota:high')

      features.push(`usage:${Math.floor((est.usage || 0) / 1000000)}mb`)
    }

    // 持久化权限：无痕模式几乎总是 false
    if ('persist' in navigator.storage) {
      const persisted = await navigator.storage.persisted()
      features.push(`persisted:${persisted}`)
    }
  }
  catch (e) {
    console.error(e)
    features.push('storage:error')
  }

  return features.join('|')
}

// get browser brand component
async function getBrowserBrandComponent() {
  // 方法 1：User Agent Client Hints
  if ('userAgentData' in navigator) {
    try {
      const brands = (navigator.userAgentData as any)?.brands ?? []
      if (brands && brands.length > 0) {
        const brand = brands.find((b: any) =>
          !b.brand.includes('Chromium')
          && !b.brand.includes('Not'),
        )
        if (brand)
          return brand.brand
      }

      const highEntropy = await (navigator.userAgentData as any)?.getHighEntropyValues([
        'brands',
        'fullVersionList',
      ])
      const fullBrand = highEntropy.brands?.find((b: any) =>
        b.brand.includes('Edge') || b.brand.includes('Chrome'),
      )
      if (fullBrand)
        return fullBrand.brand
    }
    catch (e) {
      console.error(e)
    }
  }

  // 方法 2：User Agent 字符串
  const ua = navigator.userAgent
  if (ua.includes('Edg/'))
    return 'Microsoft Edge'
  if (ua.includes('Chrome/'))
    return 'Google Chrome'
  if (ua.includes('Safari/') && !ua.includes('Chrome'))
    return 'Safari'
  return 'unknown'
}

// get browser specific component
function getBrowserSpecificComponent() {
  const features = []

  // Edge 独有特征
  if ('msLaunchUri' in navigator)
    features.push('edge:msLaunchUri')
  if ('chrome' in window && (window.chrome as any).webstore)
    features.push('chrome:webstore')

  // Edge 的 PDF 查看器
  if (navigator.pdfViewerEnabled !== undefined) {
    features.push(`pdf:${navigator.pdfViewerEnabled}`)
  }

  // CSS 特性检测
  if (CSS.supports('backdrop-filter', 'blur(10px)')) {
    features.push('css:backdrop-filter')
  }

  // WebGL 供应商（Edge 和 Chrome 可能不同）
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')! || canvas.getContext('experimental-webgl')!
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        features.push(`webgl:${vendor.substring(0, 20)}`)
      }
    }
  }
  catch (e) {
    console.error(e)
  }

  return features.join('|')
}

const fingerprint = useAppStorageSync<string>(AppConstPersistKey.FINGERPRINT, '', { storage: enhancedBase64LocalStorage() })

const useAppStoreFingerprintInside = defineStore(StoreKeys.APP_FINGERPRINT, {
  state: (): IStoreApp.Fingerprint => ({
    fingerprint,
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

      const storageSig = await getStorageComponent()
      const browserBrand = await getBrowserBrandComponent()
      const browserFeatures = getBrowserSpecificComponent()

      // add custom components here
      const extendComponents: UnknownComponents = {
        storageSig: { value: storageSig, duration: Infinity },
        browserBrand: { value: browserBrand, duration: Infinity },
        browserFeatures: { value: browserFeatures, duration: Infinity },
      }

      const visiterId = FingerprintJS.hashComponents({
        ...result.components,
        ...extendComponents,
      })

      console.log('Visitor ID:', visiterId)
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
