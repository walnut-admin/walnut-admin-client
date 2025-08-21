import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { SortOrder } from 'naive-ui/lib/data-table/src/interface'

declare module 'axios' {
  interface AxiosRequestConfig {
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
     * auto decrypt response data with `crypto-js`
     */
    _autoDecryptResponseData?: booloean

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
  }

}

declare global {
  interface WalnutAxiosConfig {
    originalConfig: AxiosRequestConfig
    extendConfig: WalnutAxiosTransform
  }

  /**
   * @description Custom transform type
   */
  interface WalnutAxiosTransform {
    /**
     * @description Axios original request interceptor
     */
    requestInterceptors?: (
      config: AxiosRequestConfig
    ) => AxiosRequestConfig | Promise<AppBaseModel>

    /**
     * @description Axios original request error catch
     */
    requestInterceptorsCatch?: (error: Error) => void

    /**
     * @description Axios original response interceptor
     */
    responseInterceptors?: (
      res: AxiosResponse<WalnutBaseResponseStructure>
    ) => Promise<AppBaseModel | void>

    /**
     * @description Axios original response error catch
     */
    responseInterceptorsCatch?: <T = any>(error: AxiosError<T>) => void
  }

  /**
   * @description Back end api base result structure
   */
  interface WalnutBaseResponseStructure<T = AppBaseModel> {
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
  interface WalnutBaseListResponse<T = AppBaseModel> {
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
  type WalnutBaseSortParams<T = AppBaseModel> = {
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
  interface WalnutBaseListParams<T = AppBaseModel> {
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
