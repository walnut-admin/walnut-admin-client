import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { SortOrder } from 'naive-ui/lib/data-table/src/interface'
import type { IModels } from '@/api/models'

declare module 'axios' {
  interface AxiosRequestConfig<D> {
    /**
     * carry token in header `Authorization Bearer`
     */
    _carryToken?: boolean

    /**
     * carry timestamp in query
     */
    _timestamp?: boolean

    /**
     * send a request doomed to be failed
     */
    _error?: boolean

    /**
     * sleep for milliseconds, need endpoint support
     */
    _sleep?: number

    /**
     * cache flag
     * optimised from https://github.com/kuitos/axios-extensions
     */
    _cache?: boolean

    /**
     * force to update the cache
     * optimised from https://github.com/kuitos/axios-extensions
     */
    _cache_force_update?: boolean

    /**
     * retry times
     * optimised from https://github.com/kuitos/axios-extensions
     */
    _retryTimes?: number

    /**
     * throttle miliseconds
     * optimised from https://github.com/kuitos/axios-extensions
     */
    _throttle?: number

    /**
     * merge same get request with different querys, mostly used for dict data API
     */
    _mergeRequest?: boolean

    /**
     * request from which page, used for cancel requests in one page
     */
    _request_from_route_path?: string

    /**
     * request id, nanoid
     */
    _request_id?: string

    /**
     * auto decrypt response specific field data
     */
    _autoDecryptResponseData?: (keyof D)[]

    /**
     * auto encrypt request specific field data
     */
    _autoEncryptRequestData?: string[]

    /**
     * prevent duplicate encrypt in request interceptor
     */
    _encrypted?: boolean

    /**
     * plain data, used for encrypt again in request interceptor
     */
    _plainData?: any
  }
}

declare global {
  interface IAxiosConfig {
    originalConfig: AxiosRequestConfig
    transformers: IAxiosTransformers
  }

  /**
   * @description Custom transform type
   */
  interface IAxiosTransformers {
    requestInterceptors?: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>
    requestInterceptorsCatch?: (error: Error) => void
    responseInterceptors?: (res: AxiosResponse<WalnutBaseResponseStructure>) => Promise<IModels.Base | void>
    responseInterceptorsCatch?: <T = any>(error: AxiosError<T>) => void
  }

  /**
   * @description Back end api base result structure
   */
  interface WalnutBaseResponseStructure<T = IModels.Base> {
    /**
     * @description request code, not equal to axios `statusCode`. This is customizable code
     */
    code: number

    /**
     * @description messages for the request
     */
    msg: string

    /**
     * @description response data structure
     */
    data: T
  }

  /**
   * @description Back list api response structure
   */
  interface WalnutBaseListResponse<T = IModels.Base> {
    /**
     * @description List base structure
     */
    data: T[]

    /**
     * @description List total
     */
    total: number
  }

  /**
   * @description base sort params
   */
  type WalnutBaseSortParams<T = IModels.Base> = {
    field: keyof T
    order: SortOrder
    priority: number
  }[]

  /**
   * @description base page params
   */
  interface WalnutBasePageParams {
    page: number
    pageSize: number
  }

  /**
   * @description Back list api params structure
   */
  interface WalnutBaseListParams<T = IModels.Base> {
    /**
     * @description query object
     */
    query?: T

    /**
     * @description sort object
     */
    sort?: WalnutBaseSortParams<T>

    /**
     * @description pagination object
     */
    page?: WalnutBasePageParams
  }
}

export { }
