import type { AxiosRequestConfig } from 'axios'
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
  config.headers[AppConstRequestHeaders.LANGUAGE] = appStoreLocale.getLocale

  // fingerprint
  config.headers[AppConstRequestHeaders.FINGERPRINT] = appStoreFingerprint.axiosReqInterceptorBuildFingerprint(config)

  // sign
  config.headers[AppConstRequestHeaders.SIGN] = appStoreSecurity.axiosReqInterceptorBuildSign(config)

  // carry token
  if (userStoreAuth.getAccessToken)
    setTokenHeaderWithConfig(config, userStoreAuth.getAccessToken)

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
