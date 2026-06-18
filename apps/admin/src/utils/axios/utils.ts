import type { AxiosRequestConfig } from 'axios'
import { getBoolean } from '@walnut/shared/shared'

/**
 * @description set auth header for axios
 */
export function setTokenHeaderWithConfig(config: AxiosRequestConfig, token: string) {
  if (getBoolean(config._carryToken))
    config.headers![AppConstRequestHeaders.AUTHORIZATION] = `Bearer ${token}`
}
