import type { AxiosAdapter, AxiosPromise } from 'axios'
import { LRUCache } from 'lru-cache'
import { BusinessCodeConst } from '../constant'
import { buildSortedURL } from '../utils'

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

export function createCacheAdapter(cacheTTLSeconds: number) {
  const cacheTTL = 1000 * cacheTTLSeconds
  const cacheAdapterCache = new LRUCache<string, AxiosPromise>({ ttl: cacheTTL, max: CAPACITY })

  return function cacheAdapter(adapter: AxiosAdapter): AxiosAdapter {
    return async (config) => {
      const { url, method, params, paramsSerializer, _cache, _cache_force_update } = config

      if (method === 'get' && _cache) {
        // build the index according to the url and params
        const index = buildSortedURL(url, params, paramsSerializer)

        let responsePromise = cacheAdapterCache.get(index)

        if (!responsePromise || _cache_force_update) {
          responsePromise = (async () => {
            try {
              const response = await adapter(config)
              if (parseResponseCode(response.data) !== BusinessCodeConst.SUCCESS)
                cacheAdapterCache.delete(index)

              return response
            }
            catch (reason) {
              cacheAdapterCache.delete(index)
              throw reason
            }
          })()

          // put the promise for the non-transformed response into cache as a placeholder
          cacheAdapterCache.set(index, responsePromise)

          return responsePromise
        }

        // turbo-console-disable-next-line
        console.info('Axios Cache', `Axios HIT CACHE: key => ${index}`)

        return responsePromise
      }

      return await adapter(config)
    }
  }
}
