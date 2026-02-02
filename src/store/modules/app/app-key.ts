import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { urlKeyAPI } from '@/api/app/key'
import { getBaiduKeyAPI } from '@/api/auth'
import { importAesKeyFromRaw } from '@/utils/crypto/shared'
import { base64ToArrayBuffer } from '@/utils/crypto/transformer'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreKeyInside = defineStore(StoreKeys.APP_KEY, {
  state: (): IStoreApp.Key => ({
    baiduAK: '',
    urlMaskingAesKey: undefined,
  }),

  getters: {
    getBaiduAK: state => state.baiduAK!,
    getUrlMaskingAesKey: state => state.urlMaskingAesKey!,
  },

  actions: {
    setBaiduAK(payload: string) {
      this.baiduAK = payload
    },

    setUrlMaskingAesKey(payload: CryptoKey) {
      this.urlMaskingAesKey = payload
    },

    async initBaiduKey() {
      if (this.getBaiduAK)
        return

      const res = await getBaiduKeyAPI()

      this.setBaiduAK(res.B!)
    },

    async initUrlMaskingAesKey() {
      if (this.getUrlMaskingAesKey)
        return

      const res = await urlKeyAPI()

      const raw = base64ToArrayBuffer(res.keyB64)
      const aesKey = await importAesKeyFromRaw(raw)

      this.setUrlMaskingAesKey(aesKey)
    },
  },
})

const useAppStoreKeyOutside = () => useAppStoreKeyInside(store)

export function useAppStoreKey() {
  if (getCurrentInstance())
    return useAppStoreKeyInside()
  return useAppStoreKeyOutside()
}
