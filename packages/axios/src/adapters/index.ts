import type { AxiosAdapter } from 'axios'
import axios from 'axios'
import { createCacheAdapter } from './cache'
import { cancelAdapter } from './cancel'
import { idAdapter } from './id'
import { mergeAdapter } from './merge'
import { retryAdapter } from './retry'
import { createThrottleAdapter } from './throttle'

const adapter = axios.getAdapter('fetch')

export interface ComposeAdaptersOptions {
  /** Cache TTL in seconds for cache and throttle adapters. Default: 60 */
  cacheTTLSeconds?: number
}

export function composeAdapters(options?: ComposeAdaptersOptions): AxiosAdapter {
  const ttl = options?.cacheTTLSeconds ?? 60

  const adapters: Array<(adapter: AxiosAdapter) => AxiosAdapter> = [
    idAdapter,
    cancelAdapter,
    createCacheAdapter(ttl),
    createThrottleAdapter(ttl),
    retryAdapter,
    mergeAdapter,
  ]

  return adapters.reduceRight((acc, enhancer) => enhancer(acc), adapter)
}
