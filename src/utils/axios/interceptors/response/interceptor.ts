import type { AxiosResponse } from 'axios'
import { get, isArray, set } from 'lodash-es'
import { AppAxios } from '../..'
import { removeCurrentPageRequests } from '../../adapters/cancel'
import { BussinessCodeConst, errorCodeList } from '../../constant'
import { SingletonPromiseCapJSToken } from './capJSToken'
import { decryptResponseValue } from './crypto'
import { SingletonPromiseRefreshToken } from './refreshToken'
import { SingletonPromiseSign } from './sign'

const userStoreAuth = useAppStoreUserAuth()

export async function responseInterceptors(res: AxiosResponse<WalnutBaseResponseStructure<AppBaseModel>, any>) {
  // code below is custom code in `axios.response.data`
  const { code, data, msg } = res.data

  // normal success
  if (code === BussinessCodeConst.SUCCESS) {
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

  // cap js token refresh (front end only and invisible mode)
  // https://capjs.js.org/guide/invisible.html
  if (code === BussinessCodeConst.CAPJS_TOKEN_EXPIRED) {
    await SingletonPromiseCapJSToken()
    return await AppAxios.request(res.config)
  }

  // when access token is expired, call refresh token api to get new token
  if (code === BussinessCodeConst.ACCESS_TOKEN_EXPIRED) {
    await SingletonPromiseRefreshToken(res.config)
    return await AppAxios.request(res.config)
  }

  // when signature is expired, call session key api to get new aes key
  if (code === BussinessCodeConst.SIGNATURE_EXPIRED) {
    await SingletonPromiseSign()
    return await AppAxios.request(res.config)
  }

  // refresh token is expired, so this user need to signout and re-signin
  if (code === BussinessCodeConst.REFRESH_TOKEN_EXPIRED) {
    await userStoreAuth.Signout(false)
    return Promise.reject(new Error('Refersh Token Expired'))
  }

  // custom error cdoe
  if (errorCodeList.includes(code)) {
    // device not allowed
    if (code === BussinessCodeConst.DEVICE_NOT_ALLOWED) {
      // not actually working, but sometimes it can cancel some requests
      // TODO other type
      removeCurrentPageRequests(AppRouter.currentRoute.value.path)
      await AppRouter.replace({ name: AppNotAllowedName, query: { type: 'device' } })
      return Promise.reject(new Error('Device Not Allowed'))
    }
    else {
      useAppMsgError(msg)
      return Promise.reject(new Error('Error'))
    }
  }
}
