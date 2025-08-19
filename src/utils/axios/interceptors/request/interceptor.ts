import type { AxiosRequestConfig } from 'axios'
import { getBoolean } from '@/utils/shared'
import { easyTransformObjectStringBoolean } from 'easy-fns-ts'
import { setTokenHeaderWithConfig } from '../../utils'

const userAuth = useAppStoreUserAuth()
const appLocale = useAppStoreLocale()
const appSign = useAppStoreSign()
const appFingerprint = useAppStoreFingerprint()

export function requestInterceptors(config: AxiosRequestConfig) {
  // avoid use ! below for ts
  if (!config.headers) {
    config.headers = {}
  }

  // axios transformRequest would transform config.data to string
  // since we have singleton promise in response interceptor, some requests would re-sent again after singleton promise resolved
  // config.data below would be a string, so we need to parse it to object
  const bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data

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
  if (config._timestamp) {
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
  if (config._transformStringBoolean && bodyData)
    config.data = easyTransformObjectStringBoolean(bodyData)

  return config
}
