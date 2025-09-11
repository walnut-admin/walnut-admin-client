import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreAdapterInside = defineStore(StoreKeys.APP_ADAPTER, {
  state: (): IStoreApp.Adapter => ({
    device: AppConstDevice.DESKTOP,
  }),

  getters: {
    getDevice(state) {
      return state.device
    },
    isMobile(state) {
      return state.device === AppConstDevice.MOBILE
    },
  },

  actions: {
    setDevice(payload: ValueOfAppConstDevice) {
      this.device = payload
    },
  },
})

const useAppStoreAdapterOutside = () => useAppStoreAdapterInside(store)

export function useAppStoreAdapter() {
  if (getCurrentInstance())
    return useAppStoreAdapterInside()
  return useAppStoreAdapterOutside()
}
