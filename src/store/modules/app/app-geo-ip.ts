import type { Nullable } from 'easy-fns-ts'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { initialDeviceAPI } from '@/api/system/device'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const deviceId = useAppStorageSync<Nullable<string>>(AppConstPersistKey.GEO_IP_DEVICE_ID, null)

const geoInfo = useAppStorageSync<IStoreApp.GeoIP['geoInfo']>(AppConstPersistKey.GEO_IP_GEO_INFO, {
  countryCode: '',
  longitude: 0,
  latitude: 0,
})

const useAppStoreGeoIPInside = defineStore(StoreKeys.APP_GEO_IP, {
  state: (): IStoreApp.GeoIP => ({
    deviceId,
    geoInfo: geoInfo.value,
  }),

  getters: {
    getDeviceId(state) {
      return state.deviceId
    },
    getLng(state) {
      return state.geoInfo.longitude as number
    },
    getLat(state) {
      return state.geoInfo.latitude as number
    },
    getCountryCode(state) {
      return state.geoInfo.countryCode
    },
  },

  actions: {
    async setupDeviceId() {
      if (this.getDeviceId) {
        return
      }
      const res = await initialDeviceAPI()
      this.$patch(res)
    },
  },
})

const useAppStoreGeoIPOutside = () => useAppStoreGeoIPInside(store)

export function useAppStoreGeoIP() {
  if (getCurrentInstance())
    return useAppStoreGeoIPInside()
  return useAppStoreGeoIPOutside()
}
