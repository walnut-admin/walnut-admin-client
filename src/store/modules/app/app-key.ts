import { getBaiduKeyAPI } from '@/api/auth'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreKeyInside = defineStore(StoreKeys.APP_KEY, {
  state: (): IAppStoreKey => ({
    baiduAK: '',
  }),

  getters: {
    getBaiduAK: state => state.baiduAK,
  },

  actions: {
    setBaiduAK(payload: string) {
      this.baiduAK = payload
    },

    async initBaiduKey() {
      if (this.getBaiduAK)
        return

      const res = await getBaiduKeyAPI()

      this.setBaiduAK(res.B!)
    },
  },
})

const useAppStoreKeyOutside = () => useAppStoreKeyInside(store)

export function useAppStoreKey() {
  if (getCurrentInstance())
    return useAppStoreKeyInside()
  return useAppStoreKeyOutside()
}
