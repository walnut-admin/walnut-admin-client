import type { AxiosRequestConfig } from 'axios'
import { rsaPublicKeyAPI } from '@/api/security/rsa'
import { signAesKeyAPI, signInitialAPI } from '@/api/security/sign'
import { AxiosQsParamsSerializer } from '@/utils/axios/core/config'
import { generateNonce } from '@/utils/axios/utils'
import { decryptWithPrivateKey, generateRSAKeyPair } from '@/utils/crypto/asymmetric/rsaoaep'
import { enhancedBase64LocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { objectToPaths } from '@/utils/shared'
import CryptoJS from 'crypto-js'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSecurityInside = defineStore(StoreKeys.APP_SECURITY, {
  state: (): IAppStoreSecurity => ({
    // get from API
    serverRsaPubKey: '',
    // 30 days
    clientRsaPubKey: useAppStorageSync<string>(AppConstPersistKey.RSA_PUBLIC_KEY, '', { expire: 30 * 24 * 60 * 60 * 1000 }),
    // 30 days
    clientRsaPrivKey: useAppStorageSync<string>(AppConstPersistKey.RSA_PRIVATE_KEY, '', { expire: 30 * 24 * 60 * 60 * 1000 }),
    // 15 minutes
    signAesSecretKey: useAppStorageSync<string>(AppConstPersistKey.SIGN_AES_KEY, '', { expire: 15 * 60 * 1000, storage: enhancedBase64LocalStorage() }),
  }),

  getters: {
    getSeverRsaPubKey(state) {
      return state.serverRsaPubKey
    },

    getClientRsaPubKey(state) {
      return state.clientRsaPubKey!
    },

    getClientPrivKey(state) {
      return state.clientRsaPrivKey!
    },

    getSignAesSecretKey(state) {
      return state.signAesSecretKey!
    },
  },

  actions: {
    async getServerRsaPubKey() {
      if (this.getSeverRsaPubKey) {
        return this.getSeverRsaPubKey
      }
      const resPubKey = await rsaPublicKeyAPI()
      this.serverRsaPubKey = resPubKey
      return resPubKey
    },

    async setupSign() {
      if (!this.getClientPrivKey || !this.getClientRsaPubKey) {
        // setup RSA keypair
        const keyPair = await generateRSAKeyPair()
        this.clientRsaPrivKey = keyPair?.privateKey as string
        this.clientRsaPubKey = keyPair?.publicKey as string

        // call handshake API to save rsa pub key in backend redis
        await signInitialAPI(this.getClientRsaPubKey)
      }

      if (!this.getSignAesSecretKey) {
        await this.getSignAesKey()
      }
    },

    async getSignAesKey() {
      const res = await signAesKeyAPI()

      // decrypt session key with private key
      const realAesKey = await decryptWithPrivateKey(this.getClientPrivKey, res.encryptedAes)

      this.signAesSecretKey = realAesKey

      return realAesKey!
    },

    axiosReqInterceptorBuildSign(config: AxiosRequestConfig) {
      // timestamp & nonce
      const timestamp = Date.now()
      const nonce = generateNonce()
      config.headers!['x-timestamp'] = timestamp
      config.headers!['x-nonce'] = nonce

      const ua = navigator.userAgent

      // fix request again would cause sign `config.data` error
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

      return CryptoJS.HmacSHA256(raw, this.getSignAesSecretKey).toString()
    },
  },
})

const useAppStoreSecurityOutside = () => useAppStoreSecurityInside(store)

export function useAppStoreSecurity() {
  if (getCurrentInstance())
    return useAppStoreSecurityInside()
  return useAppStoreSecurityOutside()
}
