import type { AxiosRequestConfig } from 'axios'
import { getBoolean } from '@/utils/shared'
import { setTokenHeaderWithConfig } from '../../utils'

const userStoreAuth = useAppStoreUserAuth()
const appStoreLocale = useAppStoreLocale()
const appStoreSecurity = useAppStoreSecurity()
const appStoreFingerprint = useAppStoreFingerprint()

export function requestInterceptors(config: AxiosRequestConfig) {
  // avoid use ! below for ts
  if (!config.headers) {
    config.headers = {}
  }

  // custom headers
  config.headers['x-language'] = appStoreLocale.locale

  // fingerprint
  // assign the x-fingerprint header
  config.headers['x-fingerprint'] = appStoreFingerprint.axiosReqInterceptorBuildFingerprint(config)

  // sign
  // assign the x-sign header/x-timestamp/x-nonce three headers
  config.headers['x-sign'] = appStoreSecurity.axiosReqInterceptorBuildSign(config)

  // a request doomed to fail
  if (config._error)
    config.headers['x-error'] = 1

  // sleep for a while
  if (config._sleep)
    config.headers['x-sleep'] = config._sleep

  // carry token
  if (getBoolean(config._carryToken))
    userStoreAuth.accessToken && setTokenHeaderWithConfig(config, userStoreAuth.accessToken)

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

  return config
}
