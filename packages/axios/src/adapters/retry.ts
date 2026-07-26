import type { AxiosAdapter, AxiosResponse } from 'axios'
import { BusinessCodeConst } from '../constant'

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

export function retryAdapter(adapter: AxiosAdapter): AxiosAdapter {
  return async (config) => {
    const { _retryTimes } = config

    if (_retryTimes) {
      let timeUp = false
      let count = 0

      const request = async (): Promise<AxiosResponse> => {
        try {
          const response = await adapter(config)

          if (parseResponseCode(response.data) !== BusinessCodeConst.SUCCESS) {
            timeUp = _retryTimes === count
            if (timeUp)
              return response

            count++
            return request()
          }

          return response
        }
        catch (e) {
          timeUp = _retryTimes === count
          if (timeUp)
            throw e

          count++
          return request()
        }
      }
      return request()
    }

    return await adapter(config)
  }
}
