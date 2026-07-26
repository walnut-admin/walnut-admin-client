import type { AxiosRequestConfig } from 'axios'
import { composeAdapters } from '@walnut/axios/adapters/index'
import qs from 'qs'

const { axiosTimeout: axiosTimeoutSeconds, axiosCache: axiosCacheSeconds } = useAppEnvSeconds()

const { httpUrl } = useAppEnvProxy()

export function AxiosQsParamsSerializer(params: any) {
  return qs.stringify(params, { arrayFormat: 'comma' })
}

export const originalConfig: AxiosRequestConfig = {
  baseURL: httpUrl,

  withCredentials: true,

  paramsSerializer: {
    // default, string array use comma to join into string
    // ['a', 'b'] => 'a,b'
    serialize: AxiosQsParamsSerializer,
  },

  // time out, default is 10s
  timeout: Number(axiosTimeoutSeconds) * 1000,

  // adapter
  adapter: composeAdapters({ cacheTTLSeconds: Number(axiosCacheSeconds) }),

  _cancelOnRouteChange: true,
}
