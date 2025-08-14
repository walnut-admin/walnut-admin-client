import type { AxiosResponse } from 'axios'
import { AppResponseEncryption } from '@/utils/crypto'
import { removeCurrentPageRequests } from '../../adapters/cancel'
import { BussinessCodeConst, errorCodeList } from '../../constant'
import { RefreshCapJSTokenLogic } from './capJSToken'
import { RefreshTokenLogic } from './refreshToken'

const userAuth = useAppStoreUserAuth()

export async function responseInterceptors(res: AxiosResponse<WalnutBaseResponseStructure<AppBaseModel>, any>) {
  // code below is custom code in `axios.response.data`
  const { code, data, msg } = res.data

  // normal success
  if (code === BussinessCodeConst.SUCCESS) {
    // auto decrypt response data with `crypto-js`
    if (res.config._autoDecryptResponseData)
      return Promise.resolve(AppResponseEncryption.decrypt(data))

    return Promise.resolve(data)
  }

  // cap js token refresh (front end only and invisible mode)
  // https://capjs.js.org/guide/invisible.html
  if (code === BussinessCodeConst.CAPJS_TOKEN_EXPIRED) {
    const config = res.config
    return await RefreshCapJSTokenLogic(config)
  }

  // when access token is expired, call refresh token api to get new token
  if (code === BussinessCodeConst.ACCESS_TOKEN_EXPIRED) {
    const config = res.config
    // TODO router push too fast, which means last page going on requesting, then go to another page, will cause fake death of page
    return await RefreshTokenLogic(config)
  }

  // refresh token is expired, so this user need to signout and re-signin
  if (code === BussinessCodeConst.REFRESH_TOKEN_EXPIRED) {
    await userAuth.Signout(false)
    return Promise.reject(new Error('Error'))
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
