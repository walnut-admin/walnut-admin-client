import type { AxiosRequestConfig } from 'axios'
import { getSignCache } from '@/App/src/scripts/sign'
import { objectToPaths } from '@/utils/shared'
// @ts-expect-error ts path error
import buildURL from 'axios/lib/helpers/buildURL'
import CryptoJS from 'crypto-js'
import { merge } from 'lodash-es'
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

/**
 * @description build sign header value for axios
 */
export function buildSign(config: AxiosRequestConfig, timestamp: number, nonce: string) {
  const ua = navigator.userAgent

  const signRef = getSignCache()

  const params = merge(config.params, config.data)
  const flatternObj = objectToPaths(params)

  const sorted = Object.keys(flatternObj)
    .sort()
    .map(k => `${k}=${flatternObj[k]}`)
    .join('&')

  const raw = [
    config.method!.toUpperCase(),
    config.url,
    sorted,
    `timestamp=${timestamp}`,
    `nonce=${nonce}`,
    `serial=${signRef.serverSn}`,
    `ua=${ua}`,
  ].join('|')

  const sign = CryptoJS.HmacSHA256(raw, signRef.secret).toString()

  return sign
}
