import type { AxiosAdapter } from 'axios'
import axios from 'axios'
import { cacheAdapter } from './cache'
import { cancelAdapter } from './cancel'
import { idAdapter } from './id'
import { mergeAdapter } from './merge'
import { retryAdapter } from './retry'
import { throttleAdapter } from './throttle'

const adapter = axios.getAdapter('fetch')

const adapters: Array<(adapter: AxiosAdapter) => AxiosAdapter> = [
  idAdapter,
  cancelAdapter,
  cacheAdapter,
  throttleAdapter,
  retryAdapter,
  mergeAdapter,
]

export function composeAdapters(): AxiosAdapter {
  return adapters.reduceRight((acc, enhancer) => enhancer(acc), adapter)
}
