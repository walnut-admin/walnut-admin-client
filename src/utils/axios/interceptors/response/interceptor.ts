import type { AxiosResponse } from 'axios'
import type { IAxios } from '../../types'
import type { IModels } from '@/api/models'
import { get, isArray, set } from 'lodash-es'
import { layoutConst } from '@/router/routes/builtin'
import { mainoutConst } from '@/router/routes/mainout'
import { AppAxios } from '../..'
import { removeCurrentPageRequests } from '../../adapters/cancel'
import { BusinessCodeConst, errorCodeList, notAllowedErrorCodeMap } from '../../constant'
import { SingletonPromiseCapJSInteraction, SingletonPromiseCapJSRefresh } from './capJSToken'
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

  // cap js token interaction required
  // manually call cap global modal and verify
  if (code === BusinessCodeConst.CAPJS_TOKEN_INTERACTION_REQUIRED) {
    await SingletonPromiseCapJSInteraction()
    return await AppAxios.request(res.config)
  }

  // cap js token refresh required
  // https://capjs.js.org/guide/invisible.html
  if (code === BusinessCodeConst.CAPJS_TOKEN_REFRESH_REQUIRED) {
    await SingletonPromiseCapJSRefresh()
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
    // allow to execute encrypt logic in request interceptor again
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
  if (Object.keys(notAllowedErrorCodeMap).map(Number).includes(code)) {
    removeCurrentPageRequests(AppRouter.currentRoute.value.path)
    await AppRouter.replace({ name: mainoutConst.notAllowed.name, force: true, query: { type: notAllowedErrorCodeMap[code] } })
    return Promise.reject(new Error('Not Allowed'))
  }

  // mfa required
  if (code === BusinessCodeConst.MFA_REQUIRED) {
    await AppRouter.replace({ name: mainoutConst.mfaRequired.name, force: true })
    return Promise.reject(new Error('MFA Required'))
  }

  // mfa verified
  if (code === BusinessCodeConst.MFA_VERIFIED) {
    await AppRouter.replace({ name: mainoutConst.mfaVerified.name, force: true })
    return Promise.reject(new Error('MFA Verified'))
  }

  // custom error code
  if (errorCodeList.includes(code)) {
    useAppMsgError(msg)
    return Promise.reject(new Error('Error'))
  }

  if (code === BusinessCodeConst.INTERVAL_SERVER_ERROR) {
    await AppRouter.replace({ name: layoutConst.serverError.name, force: true })
  }

  return Promise.reject(new Error('Missing Error Code'))
}
