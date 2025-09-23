import type { IStoreApp } from '@/store/types'
import axios from 'axios'
import { defineStore } from 'pinia'
import { initialDeviceAPI } from '@/api/system/device'
import { isDev } from '@/utils/constant/vue'
import { getCookie } from '@/utils/persistent/Cookie'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreGeoIPInside = defineStore(StoreKeys.APP_GEO_IP, {
  state: (): IStoreApp.GeoIP => ({
    // 30 days
    deviceId: useAppStorageSync<string>(AppConstPersistKey.DEVICE_ID, '', { expire: 30 * 24 * 60 * 60 * 1000 }),
    // 7 days for geo ip cache
    geoInfo: useAppStorageSync<Partial<IStoreApp.GeoIPInfo>>(AppConstPersistKey.GEO_IP_INFO, {}, { expire: 7 * 24 * 60 * 60 * 1000 }),
  }),

  getters: {
    getDeviceId(state) {
      return state.deviceId
    },
    getGeoInfo(state) {
      return state.geoInfo!
    },
    getLng(state) {
      return state.geoInfo?.longitude as number
    },
    getLat(state) {
      return state.geoInfo?.latitude as number
    },
    getIp(state) {
      return state.geoInfo?.ip as string
    },
  },

  actions: {
    async setupDeviceId() {
      if (this.getDeviceId)
        return

      const res = await initialDeviceAPI()
      this.deviceId = res.deviceId
    },

    async setupGeoIP() {
      // Development environment with existing cache: return directly
      if (isDev() && this.getIp)
        return

      // IP from cookie (written by backend)
      const ipFromCookie = getCookie('ip')

      // Need to refresh if: cache is empty OR IP has changed
      const needRefresh = !this.getIp || (!isDev() && ipFromCookie && ipFromCookie !== this.getIp)

      if (!needRefresh)
        return

      const res = await axios.get<IStoreApp.GeoIPInfo>(EXTERNAL_LINKS.GEOIP)

      if (res.status === 200)
        this.geoInfo = res.data
    },
  },
})

const useAppStoreGeoIPOutside = () => useAppStoreGeoIPInside(store)

export function useAppStoreGeoIP() {
  if (getCurrentInstance())
    return useAppStoreGeoIPInside()
  return useAppStoreGeoIPOutside()
}
