import type { AxiosRequestConfig } from 'axios'
import { AppRequestEncryption } from '@/utils/crypto'
import { getBoolean } from '@/utils/shared'
import { easyTransformObjectStringBoolean } from 'easy-fns-ts'
import { merge } from 'lodash-es'
import { setTokenHeaderWithConfig } from '../../utils'

const userAuth = useAppStoreUserAuth()
const appLocale = useAppStoreLocale()
const appSign = useAppStoreSign()
const appFingerprint = useAppStoreFingerprint()

export function requestInterceptors(config: AxiosRequestConfig) {
  const isRequestAfterRefreshedToken = getBoolean(config._request_after_refresh_token, false)

  // avoid use ! below for ts
  if (!config.headers) {
    config.headers = {}
  }

  // custom headers
  config.headers['x-language'] = appLocale.locale

  // fingerprint
  // assign the x-fingerprint header
  config.headers['x-fingerprint'] = appFingerprint.axiosReqInterceptorBuildFingerprint(config)

  // sign
  // assign the x-sign header/x-timestamp/x-nonce three headers
  config.headers['x-sign'] = appSign.axiosReqInterceptorBuildSign(config)

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
}
