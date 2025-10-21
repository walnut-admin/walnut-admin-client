import type { AxiosRequestConfig } from 'axios'
import qs from 'qs'
import { composeAdapters } from '../adapters'

const { axiosTimeout: axiosTimeoutSeconds } = useAppEnvSeconds()

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
  adapter: composeAdapters(),

  _cancelOnRouteChange: true,
}
