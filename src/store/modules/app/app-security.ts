import type { AxiosRequestConfig } from 'axios'
import type { IStoreApp } from '@/store/types'
import CryptoJS from 'crypto-js'
import { isUndefined, omitBy } from 'lodash-es'
import { defineStore } from 'pinia'
import { rsaPublicKeyAPI } from '@/api/security/rsa'
import { signAesKeyAPI, signInitialAPI } from '@/api/security/sign'
import { AxiosQsParamsSerializer } from '@/utils/axios/core/config'
import { generateNonce } from '@/utils/axios/utils'
import { decryptWithPrivateKey, generateRSAKeyPair } from '@/utils/crypto/asymmetric/rsa-oaep'
import { enhancedAesGcmLocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageAsync } from '@/utils/persistent/storage/async'
import { SingletonPromise } from '@/utils/queue'
import { objectToPaths } from '@/utils/shared'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

/**
 * HKDF-SHA256 实现（密钥派生函数）
 *
 * 用于从 Session Key Hash 派生签名密钥
 *
 * @param ikm Input Keying Material（输入密钥材料）
 * @param salt 盐值
 * @param info 用途标识
 * @param length 输出长度（字节）
 * @returns 派生的密钥（WordArray）
 */
function hkdfSha256(
  ikm: CryptoJS.lib.WordArray,
  salt: CryptoJS.lib.WordArray,
  info: CryptoJS.lib.WordArray,
  length: number,
): CryptoJS.lib.WordArray {
  // 1. HKDF-Extract: PRK = HMAC-SHA256(salt, ikm)
  const prk = CryptoJS.HmacSHA256(ikm, salt)

  // 2. HKDF-Expand
  const n = Math.ceil(length / 32) // SHA256 输出 32 字节
  let t = CryptoJS.lib.WordArray.create()
  const okm = CryptoJS.lib.WordArray.create()

  for (let i = 1; i <= n; i++) {
    const concat = t.clone()
    concat.concat(info)

    // ✅ 正确：创建单字节计数器
    const counter = CryptoJS.enc.Latin1.parse(String.fromCharCode(i))
    concat.concat(counter)

    t = CryptoJS.HmacSHA256(concat, prk)
    okm.concat(t)
  }

  // 3. 截取到指定长度
  okm.sigBytes = length
  return okm
}

/**
 * 派生 API 签名密钥
 *
 * 算法：sessionDerivedKey = HKDF-SHA256(sessionKeyHash, aesKey, info)
 *
 * 说明：
 * - sessionKeyHash: Session Key 的 SHA256 哈希值（服务端也存储这个 hash）
 * - aesKey: 握手时协商的 AES 密钥（作为 salt）
 * - info: 固定字符串 "walnut-admin-api-sign-v1"（用途标识）
 *
 * @param sessionKey 登录时返回的 Session Key（base64 编码）
 * @param aesKey 握手时协商的 AES Key
 * @returns 派生的签名密钥（WordArray）
 */
function deriveApiSignKey(sessionKey: string, aesKey: string): CryptoJS.lib.WordArray {
  // 1. 将 base64 编码的 session key 转换为 WordArray
  const sessionKeyWordArray = CryptoJS.enc.Base64.parse(sessionKey)

  // 2. 计算 Session Key 的 SHA256 哈希（与服务端保持一致）
  const sessionKeyHash = CryptoJS.SHA256(sessionKeyWordArray)

  // 3. 将 AES Key 转换为 WordArray（作为 salt）
  const aesKeyWordArray = CryptoJS.enc.Utf8.parse(aesKey)

  // 4. 用途标识（与服务端保持一致）
  const info = CryptoJS.enc.Utf8.parse('walnut-admin-api-sign-v1')

  // 5. 使用 HKDF 派生签名密钥
  const derivedKey = hkdfSha256(
    sessionKeyHash, // IKM
    aesKeyWordArray, // salt
    info, // info
    32, // 输出 32 字节
  )

  return derivedKey
}

// eslint-disable-next-line antfu/no-top-level-await
const clientRsaPubKeyStorage = await useAppStorageAsync(AppConstPersistKey.RSA_PUBLIC_KEY, '', { expire: 30 * 24 * 60 * 60 * 1000, storage: enhancedAesGcmLocalStorage(true) })
// eslint-disable-next-line antfu/no-top-level-await
const clientRsaPrivKeyStorage = await useAppStorageAsync(AppConstPersistKey.RSA_PRIVATE_KEY, '', { expire: 30 * 24 * 60 * 60 * 1000, storage: enhancedAesGcmLocalStorage(true) })
// eslint-disable-next-line antfu/no-top-level-await
const sessionKeyStorage = await useAppStorageAsync(AppConstPersistKey.AUTH_SESSION_KEY, '', { expire: 24 * 60 * 60 * 1000, ttlMode: 'sliding' })

const rsaPubKeyOutDatedQueue = new SingletonPromise<void>()

function SingletonPromiseRsaPubKeyOutDated() {
  return rsaPubKeyOutDatedQueue.run(async () => {
    const appStoreSecurity = useAppStoreSecurity()
    await appStoreSecurity.sendRsaPubKeyToServer(true)
    await appStoreSecurity.getSignAesKey()
  })
}

const useAppStoreSecurityInside = defineStore(StoreKeys.APP_SECURITY, {
  state: (): IStoreApp.Security => ({
    // get from API
    serverRsaPubKey: '',
    // 30 days
    clientRsaPubKey: clientRsaPubKeyStorage,
    // 30 days
    clientRsaPrivKey: clientRsaPrivKeyStorage,
    // in memory
    signAesSecretKey: '',
    // 1 day sliding
    sessionKey: sessionKeyStorage,
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

    getSessionKey(state) {
      return state.sessionKey!
    },
  },

  actions: {
    clearServerRsaPubKey() {
      this.serverRsaPubKey = ''
    },

    clearSessionKey() {
      this.sessionKey = ''
    },

    setSessionKey(payload: string) {
      this.sessionKey = payload
    },

    touchSessionKey() {
      const sessionKey = structuredClone(this.getSessionKey)
      this.clearSessionKey()
      this.setSessionKey(sessionKey!)
    },

    async getServerRsaPubKey() {
      if (this.getSeverRsaPubKey) {
        return this.getSeverRsaPubKey
      }
      const resPubKey = await rsaPublicKeyAPI()
      this.serverRsaPubKey = resPubKey
      return resPubKey
    },

    async sendRsaPubKeyToServer(force: boolean) {
      // call handshake API to save rsa pub key in backend redis
      await signInitialAPI(this.getClientRsaPubKey, force)
    },

    async setupSign() {
      if (!this.getClientPrivKey || !this.getClientRsaPubKey) {
        // setup RSA key pair
        const keyPair = await generateRSAKeyPair()
        this.clientRsaPrivKey = keyPair?.privateKey as string
        this.clientRsaPubKey = keyPair?.publicKey as string

        await this.sendRsaPubKeyToServer(false)
      }

      if (!this.getSignAesSecretKey) {
        await this.getSignAesKey()
      }
    },

    async getSignAesKey() {
      const res = await signAesKeyAPI()

      // decrypt session key with private key
      const realAesKey = await decryptWithPrivateKey(this.getClientPrivKey, res.encryptedAes)

      // if logic go here, is mostly like user has a new rsa pair key that does not match ths rsa pub key in backend redis
      // we need to call initial rsa pub key again to update the rsa pub key in backend redis
      if (!realAesKey) {
        await SingletonPromiseRsaPubKeyOutDated()
        return null
      }

      this.signAesSecretKey = realAesKey!

      return realAesKey!
    },

    /**
     * 构建签名原文
     *
     * 格式: METHOD|PATH|BODY_PARAMS|timestamp=xxx|nonce=xxx|ua=xxx
     */
    buildSignRaw(
      config: AxiosRequestConfig,
      timestamp: number,
      nonce: string,
    ) {
      const ua = navigator.userAgent

      // fix request again would cause sign `config.data` error
      const bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data

      // transform bodyData to flat object
      // e.g. { a: { b: 1, c: 2 } } => { 'a.b': 1, 'a.c': 2 }
      const flattenObj = objectToPaths(bodyData ?? {})

      // sort the flatten object
      // and join with &
      const sorted = Object.keys(flattenObj)
        .sort()
        .map(k => `${k}=${flattenObj[k]}`)
        .join('&')

      // need to manually put the query string params after url
      const cleanParams = omitBy(config.params, isUndefined)
      const paramsStr = Object.keys(cleanParams).length
        ? `?${AxiosQsParamsSerializer(cleanParams)}`
        : ''
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

      return raw
    },

    /**
     * 计算单因子签名（未登录模式）
     *
     * 公式：HMAC-SHA256(raw, aesKey)
     */
    computeSingleFactorSignature(raw: string, aesKey: string): string {
      return CryptoJS.HmacSHA256(raw, aesKey).toString()
    },

    /**
     * 计算双因子签名（已登录模式）
     *
     * 公式：HMAC-SHA256(raw, derivedKey)
     * 其中：derivedKey = HKDF(sessionKeyHash, aesKey, info)
     */
    computeDualFactorSignature(
      raw: string,
      sessionKey: string,
      aesKey: string,
    ): string {
    // 1. 派生签名密钥
      const derivedKey = deriveApiSignKey(sessionKey, aesKey)

      // 2. 使用派生密钥计算 HMAC
      return CryptoJS.HmacSHA256(raw, derivedKey).toString()
    },

    /**
     * Axios 请求拦截器：自动添加签名
     */
    axiosReqInterceptorBuildSign(config: AxiosRequestConfig): string {
      // 1. 生成时间戳和 Nonce
      const timestamp = Date.now()
      const nonce = generateNonce()
      config.headers![AppConstRequestHeaders.TIMESTAMP] = timestamp
      config.headers![AppConstRequestHeaders.NONCE] = nonce

      // 2. 构建签名原文
      const raw = this.buildSignRaw(config, timestamp, nonce)

      // 3. 获取 AES Key
      const aesKey = this.getSignAesSecretKey

      // 4. 判断签名模式
      const sessionKey = this.getSessionKey
      let signature: string

      if (sessionKey) {
        // 【已登录】双因子签名
        signature = this.computeDualFactorSignature(raw, sessionKey, aesKey)
      }
      else {
        // 【未登录】单因子签名
        signature = this.computeSingleFactorSignature(raw, aesKey)
      }

      return signature
    },
  },
})

const useAppStoreSecurityOutside = () => useAppStoreSecurityInside(store)

export function useAppStoreSecurity() {
  if (getCurrentInstance())
    return useAppStoreSecurityInside()
  return useAppStoreSecurityOutside()
}
