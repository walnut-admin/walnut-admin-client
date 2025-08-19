import type { AxiosRequestConfig } from 'axios'
import { authSignHandShakeAPI, authSignSessionKeyAPI } from '@/api/auth/sign'
import { AxiosQsParamsSerializer } from '@/utils/axios/core/config'
import { generateNonce } from '@/utils/axios/utils'
import { decryptWithPrivateKey, generateRSAKeyPair } from '@/utils/crypto/asymmetric/rsaoaep'
import { enhancedBase64LocalStorage } from '@/utils/persistent/enhance'
import { useAppStorage2 } from '@/utils/persistent/storage2'
import { objectToPaths } from '@/utils/shared'
import CryptoJS from 'crypto-js'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSignInside = defineStore(StoreKeys.APP_SIGN, {
  state: (): IAppStoreSign => ({
    // 30 days
    publicKey: useAppStorage2<string>(AppConstPersistKey.RSA_PUBLIC_KEY, '', { expire: 30 * 24 * 3600 * 1000, storage: enhancedBase64LocalStorage }),
    // 30 days
    privateKey: useAppStorage2<string>(AppConstPersistKey.RSA_PRIVATE_KEY, '', { expire: 30 * 24 * 3600 * 1000, storage: enhancedBase64LocalStorage }),
    // 15 minutes
    aesKey: useAppStorage2<string>(AppConstPersistKey.AES_KEY, '', { expire: 15 * 60 * 1000, storage: enhancedBase64LocalStorage }),
  }),

  getters: {
    getPublicKey(state) {
      return state.publicKey!
    },

    getPrivateKey(state) {
      return state.privateKey!
    },

    getAesKey(state) {
      return state.aesKey!
    },
  },

  actions: {
    async setupSign() {
      if (this.getPrivateKey && this.getPublicKey)
        return

      // setup RSA keypair
      const keyPair = await generateRSAKeyPair()
      this.privateKey = keyPair?.privateKey as string
      this.publicKey = keyPair?.publicKey as string

      // call handshake API to save rsa pub key in backend redis
      await authSignHandShakeAPI(this.getPublicKey)

      // get encrypted session key
      const res = await authSignSessionKeyAPI()

      // decrypt session key with private key
      const realAesKey = await decryptWithPrivateKey(this.getPrivateKey, res.encryptedAes)

      this.aesKey = realAesKey
    },

    async refreshAesKey() {
      const res = await authSignSessionKeyAPI()

      // decrypt session key with private key
      const realAesKey = await decryptWithPrivateKey(this.privateKey!, res.encryptedAes)

      this.aesKey = realAesKey

      return realAesKey!
    },

    axiosReqInterceptorBuildSign(config: AxiosRequestConfig) {
      // timestamp & nonce
      const timestamp = Date.now()
      const nonce = generateNonce()
      config.headers!['x-timestamp'] = timestamp
      config.headers!['x-nonce'] = nonce

      const ua = navigator.userAgent

      // axios transformRequest would transform config.data to string
      // so without change axios,
      // we need to parse it to object
      const bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data

      // transform bodyData to flat object
      // e.g. { a: { b: 1, c: 2 } } => { 'a.b': 1, 'a.c': 2 }
      const flatternObj = objectToPaths(bodyData ?? {})

      // sort the flattern object
      // and join with &
      const sorted = Object.keys(flatternObj)
        .sort()
        .map(k => `${k}=${flatternObj[k]}`)
        .join('&')

      // need to manually put the query string params after url
      const paramsStr = config.params ? `?${AxiosQsParamsSerializer(config.params)}` : ''
      const urlWithParams = `${config.url}${paramsStr}`

      // build the raw string for signing
      const raw = [
        config.method!.toUpperCase(),
        urlWithParams,
        sorted,
        `timestamp=${timestamp}`,
        `nonce=${nonce}`,
        `ua=${ua}`,
      ].join('|')

      if (!this.getAesKey)
        return 'expired-key'

      return CryptoJS.HmacSHA256(raw, this.getAesKey).toString()
    },
  },
})

const useAppStoreSignOutside = () => useAppStoreSignInside(store)

export function useAppStoreSign() {
  if (getCurrentInstance())
    return useAppStoreSignInside()
  return useAppStoreSignOutside()
}
