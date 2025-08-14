import type { AxiosAdapter, AxiosPromise } from 'axios'
import { LRUCache } from 'lru-cache'
import { BussinessCodeConst } from '../constant'
import { buildSortedURL } from '../utils'

const { axiosCache: cacheSeconds } = useAppEnvSeconds()

const CACHE_MINUTE = 1000 * cacheSeconds
const CAPACITY = 100
const cacheAdapterCache = new LRUCache<string, AxiosPromise>({ ttl: CACHE_MINUTE, max: CAPACITY })

export function cacheAdapter(adapter: AxiosAdapter): AxiosAdapter {
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
            if (JSON.parse(response.data).code !== BussinessCodeConst.SUCCESS)
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
