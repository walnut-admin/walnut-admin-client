import type { AxiosRequestConfig } from 'axios'
import { getBoolean } from '@/utils/shared'
import { cloneDeep, get, isArray, set } from 'lodash-es'
import { setTokenHeaderWithConfig } from '../../utils'
import { encryptRequestValue } from './crypto'

const userStoreAuth = useAppStoreUserAuth()
const appStoreLocale = useAppStoreLocale()
const appStoreSecurity = useAppStoreSecurity()
const appStoreFingerprint = useAppStoreFingerprint()

export async function requestInterceptors(config: AxiosRequestConfig) {
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

  // request data encrypt
  if (config._autoEncryptRequestData && !config._encrypted) {
    // tag this request to avoid encrypt again
    config._encrypted = true

    // we only handle request body data
    if (config.data) {
      // put original post data in _plainData
      config._plainData = cloneDeep(config.data)

      const keys = config._autoEncryptRequestData

      if (keys && (Array.isArray(keys) ? keys.length : true)) {
        const keyList = isArray(keys) ? keys : [keys]

        for (const key of keyList) {
          const plain = get(config.data, key)
          if (plain !== null) {
            const cipher = await encryptRequestValue(plain)
            set(config.data, key, cipher)
          }
        }
      }
    }
  }

  return config
}
