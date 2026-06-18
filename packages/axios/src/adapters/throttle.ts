import type { AxiosAdapter, AxiosPromise, InternalAxiosRequestConfig } from 'axios'
import { LRUCache } from 'lru-cache'
import { BusinessCodeConst } from '../constant'
import { buildSortedURL } from '../utils'

interface RecordedCache {
  timestamp: number
  value?: AxiosPromise
}

const CAPACITY = 100

/**
 * Safely parse response data and extract the business code.
 * Returns null if parsing fails (non-JSON response, etc.).
 */
function parseResponseCode(data: any): number | null {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data
    return parsed?.code ?? null
  }
  catch {
    return null
  }
}

export function createThrottleAdapter(cacheTTLSeconds: number) {
  const cacheTTL = 1000 * cacheTTLSeconds
  const throttleAdapterCache = new LRUCache<string, RecordedCache>({ ttl: cacheTTL, max: CAPACITY })

  return function throttleAdapter(adapter: AxiosAdapter): AxiosAdapter {
    return async (config) => {
      const { url, method, params, paramsSerializer, _throttle } = config

      if (_throttle) {
        const recordCacheWithRequest = (index: string, config: InternalAxiosRequestConfig) => {
          const responsePromise = (async () => {
            try {
              const response = await adapter(config)
              if (parseResponseCode(response.data) !== BusinessCodeConst.SUCCESS) {
                throttleAdapterCache.delete(index)
              }
              else {
                throttleAdapterCache.set(index, {
                  timestamp: Date.now(),
                  value: Promise.resolve(response),
                })
              }
              return response
            }
            catch (reason) {
              throttleAdapterCache.delete(index)
              throw reason
            }
          })()

          throttleAdapterCache.set(index, {
            timestamp: Date.now(),
            value: responsePromise,
          })

          return responsePromise
        }

        const index = buildSortedURL(url, params, paramsSerializer)

        const now = Date.now()
        const cachedRecord = throttleAdapterCache.get(index) || { timestamp: now }

        if (method === 'get') {
          if (now - cachedRecord.timestamp <= _throttle) {
            const responsePromise = cachedRecord.value
            if (responsePromise)
              return responsePromise
          }

          return recordCacheWithRequest(index, config)
        }
      }

      return await adapter(config)
    }
  }
}
