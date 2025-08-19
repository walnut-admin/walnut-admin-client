import type { AxiosRequestConfig } from 'axios'
// @ts-expect-error ts path error
import buildURL from 'axios/lib/helpers/buildURL'
import { getBoolean } from '../shared'

/**
 * @description set auth header for axios
 */
export function setTokenHeaderWithConfig(config: AxiosRequestConfig, token: string) {
  if (getBoolean(config._carryToken))
    config.headers!.Authorization = `Bearer ${token}`
}

/**
 * @description build sorted url from `axios/lib/helpers/buildURL`, used for `adapters` key
 */
export function buildSortedURL(...args: any[]) {
  const builtURL = buildURL(...args) ?? 'root-endpoint'

  const [urlPath, queryString] = builtURL.split('?')

  if (queryString) {
    const paramsPair = queryString.split('&')
    return `${urlPath}?${paramsPair.sort().join('&')}`
  }

  return builtURL
}

/**
 * @description generate nonce header value for axios
 */
export function generateNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('')
}
