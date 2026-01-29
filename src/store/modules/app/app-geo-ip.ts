import type { Nullable } from 'easy-fns-ts'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { initialDeviceAPI } from '@/api/system/device'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreGeoIPInside = defineStore(StoreKeys.APP_GEO_IP, {
  state: (): IStoreApp.GeoIP => ({
    deviceId: useAppStorageSync<Nullable<string>>(AppConstPersistKey.GEO_IP_DEVICE_ID, null),
    countryCode: useAppStorageSync<Nullable<string>>(AppConstPersistKey.GEO_IP_COUNTRY_CODE, null),
    longitude: useAppStorageSync<Nullable<number>>(AppConstPersistKey.GEO_IP_LONGITUDE, null),
    latitude: useAppStorageSync<Nullable<number>>(AppConstPersistKey.GEO_IP_LATITUDE, null),
  }),

  getters: {
    getDeviceId(state) {
      return state.deviceId
    },
    getLng(state) {
      return state.longitude as number
    },
    getLat(state) {
      return state.latitude as number
    },
    getCountryCode(state) {
      return state.countryCode
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
