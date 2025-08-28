import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import axios from 'axios'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreGeoIPInside = defineStore(StoreKeys.APP_GEO_IP, {
  state: (): IAppStoreGeoIP => ({
    geoInfo: useAppStorageSync<Partial<ExternalGeoIPInfo>>(AppConstPersistKey.GEO_IP_INFO, {}),
  }),

  getters: {
    getGeoInfo(state) {
      return state.geoInfo!
    },
    getLng(state) {
      return state.geoInfo?.longitude as number
    },
    getLat(state) {
      return state.geoInfo?.latitude as number
    },
  },

  actions: {
    async  setupGeoIP() {
      if (Object.keys(this.getGeoInfo).length)
        return

      const res = await axios.get<ExternalGeoIPInfo>(EXTERNAL_LINKS.GEOIP)

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
