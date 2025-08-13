import type { AxiosError } from 'axios'
import { fpId } from '@/App/src/scripts/fingerprint'
import { getSignCache } from '@/App/src/scripts/sign'

import { AppNotAllowedName } from '@/router/constant'
import axios from 'axios'
import {
  easyTransformObjectStringBoolean,
} from 'easy-fns-ts'
import { merge } from 'lodash-es'
import { AppRequestEncryption, AppResponseEncryption } from '../crypto'
import { RefreshCapJSTokenLogic } from './capJSToken'
import { checkReponseErrorStatus } from './checkStatus'
import { RefreshTokenLogic, setTokenHeaderWithConfig } from './refreshToken'

const userAuth = useAppStoreUserAuth()
const appLocale = useAppStoreLocale()

// custom transform for req and res interceptors
export const transform: WalnutAxiosTransform = {
  // Here handler request logic
  requestInterceptors: (config) => {
    const isRequestAfterRefreshedToken = getBoolean(config._request_after_refresh_token, false)

    // avoid use ! below for ts
    if (!config.headers) {
      config.headers = {}
    }

    // custom headers
    config.headers['x-language'] = appLocale.locale
    config.headers['x-fingerprint'] = fpId.value

    // sign & serial
    const signRef = getSignCache()
    config.headers['x-sign'] = buildSign(merge(config.params, config.data), signRef.serverSn!, signRef.secret!)
    config.headers['x-serial'] = signRef.serverSn

    // timestamp & nonce
    config.headers['x-timestamp'] = Date.now()
    config.headers['x-nonce'] = generateNonce()

    // a request doomed to fail
    if (config._error)
      config.headers['x-error'] = 1

    // sleep for a while
    if (config._sleep)
      config.headers['x-sleep'] = config._sleep

    // carry token
    if (getBoolean(config._carryToken))
      userAuth.accessToken && setTokenHeaderWithConfig(config, userAuth.accessToken)

    // add timestamp
    if (config._timestamp && !isRequestAfterRefreshedToken) {
      if (config.params) {
        config.params = Object.assign(config.params, { t: Date.now() })
      }
      else {
        config.params = {
          t: Date.now(),
        }
      }
    }

    // transform "true"/"false" to true/false
    // when config.data exists
    // and this request is not the one after refresh token
    if (config._transformStringBoolean && config.data && !isRequestAfterRefreshedToken)
      config.data = easyTransformObjectStringBoolean(config.data)

    // auto encrypt body data(post)
    if (config?._autoEncryptRequestDataFields && config._autoEncryptRequestDataFields.length !== 0 && config.data && !isRequestAfterRefreshedToken) {
      const cryptedObj = Object.fromEntries(
        config._autoEncryptRequestDataFields.map(key => [
          key,
          AppRequestEncryption.encrypt(config.data[key]),
        ]),
      )

      config.data = merge(config.data, cryptedObj)
    }

    return config
  },

  requestInterceptorsCatch: (err) => {
    return Promise.reject(err)
  },

  // Here handle response data
  responseInterceptors: async (res) => {
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
        removeCurrentPageRequests(AppRouter.currentRoute.value.path)
        await AppRouter.replace({ name: AppNotAllowedName, query: { type: 'device' } })
        return Promise.reject(new Error('Device Not Allowed'))
      }
      else {
        useAppMsgError(msg)
        return Promise.reject(new Error('Error'))
      }
    }
  },

  // Here handle response error
  responseInterceptorsCatch: async (err: AxiosError) => {
    if (err.message === 'Network Error') {
      await useAppRouterPush({ name: '500' })
      return Promise.reject(err)
    }

    if (axios.isCancel(err))
      return Promise.reject(err)

    // TODO need to take a look
    // @ts-expect-error response
    const statusCode: number = err.response?.data.statusCode
    // @ts-expect-error response
    const msg: string = err.response?.data.detail?.message
    await checkReponseErrorStatus(statusCode, msg)

    return Promise.reject(err)
  },
}
