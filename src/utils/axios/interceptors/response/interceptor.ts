import type { AxiosResponse } from 'axios'
import type { IAxios } from '../../types'
import type { IModels } from '@/api/models'
import { get, isArray, set } from 'lodash-es'
import { AppAxios } from '../..'
import { removeCurrentPageRequests } from '../../adapters/cancel'
import { BusinessCodeConst, errorCodeList, notAllowedErrorCodeMap } from '../../constant'
import { SingletonPromiseCapJSToken } from './capJSToken'
import { decryptResponseValue } from './crypto'
import { SingletonPromiseRefreshToken } from './refreshToken'
import { SingletonPromiseRsaDecryptFailed } from './rsaDecrypt'
import { SingletonPromiseRsaPubKeyNotFound } from './rsaPubKeyNotFound'
import { SingletonPromiseSign } from './sign'

const userStoreAuth = useAppStoreUserAuth()

export async function responseInterceptors(res: AxiosResponse<IAxios.BaseResponse<IModels.Base>, any>) {
  // code below is custom code in `axios.response.data`
  const { code, data, msg } = res.data

  // normal success
  if (code === BusinessCodeConst.SUCCESS) {
    // auto decrypt response data
    const keys = res.config._autoDecryptResponseData as string[]

    if (keys && (Array.isArray(keys) ? keys.length : true)) {
      const keyList = isArray(keys) ? keys : [keys]
      const decryptedData = { ...data }

      for (const key of keyList) {
        const encryptedVal = get(decryptedData, key)
        if (encryptedVal !== null) {
          const decryptedVal = await decryptResponseValue(encryptedVal)
          set(decryptedData, key, decryptedVal)
        }
      }

      return Promise.resolve(decryptedData)
    }
    return Promise.resolve(data)
  }

  // too many requests
  if (code === BusinessCodeConst.TOO_MANY_REQUESTS) {
    useAppMsgError(msg)
    return Promise.reject(new Error('Too Many Requests'))
  }

  // cap js token refresh (front end only and invisible mode)
  // https://capjs.js.org/guide/invisible.html
  if (code === BusinessCodeConst.CAPJS_TOKEN_EXPIRED) {
    await SingletonPromiseCapJSToken()
    return await AppAxios.request(res.config)
  }

  // when access token is expired, call refresh token api to get new token
  if (code === BusinessCodeConst.ACCESS_TOKEN_EXPIRED) {
    await SingletonPromiseRefreshToken(res.config)
    return await AppAxios.request(res.config)
  }

  // when signature is expired, call session key api to get new aes key
  if (code === BusinessCodeConst.SIGNATURE_EXPIRED) {
    await SingletonPromiseSign()
    return await AppAxios.request(res.config)
  }

  // refresh token is expired, so this user need to signout and re-signin
  if (code === BusinessCodeConst.REFRESH_TOKEN_EXPIRED) {
    await userStoreAuth.Signout(false)
    return Promise.reject(new Error('Refresh Token Expired'))
  }

  // rsa decrypt failed
  if (code === BusinessCodeConst.RSA_DECRYPT_FAILED) {
    // allow to excute encrypt logic in request interceptor again
    res.config._encrypted = false
    await SingletonPromiseRsaDecryptFailed(res)
    return await AppAxios.request(res.config)
  }

  // rsa pub key not found
  if (code === BusinessCodeConst.RSA_PUB_KEY_NOT_FOUND) {
    await SingletonPromiseRsaPubKeyNotFound()
    return await AppAxios.request(res.config)
  }

  // not allowed
  if (Object.values(notAllowedErrorCodeMap).map(Number).includes(code)) {
    removeCurrentPageRequests(AppRouter.currentRoute.value.path)
    await AppRouter.replace({ name: AppNotAllowedName, force: true, query: { type: notAllowedErrorCodeMap[code] } })
    return Promise.reject(new Error('Not Allowed'))
  }

  // custom error code
  if (errorCodeList.includes(code)) {
    useAppMsgError(msg)
    return Promise.reject(new Error('Error'))
  }

  return Promise.reject(new Error('Missing Error Code'))
}
