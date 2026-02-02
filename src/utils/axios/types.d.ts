import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { DataTableSortOrder } from 'naive-ui'
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
     * cancel this request when route change
     */
    _cancelOnRouteChange?: boolean

    /**
     * request id, nanoid
     */
    _requestId?: string

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

export namespace IAxios {
  export interface Config {
    originalConfig: AxiosRequestConfig
    transformers: Transformers
  }

  /**
   * @description Custom transform type
   */
  export interface Transformers {
    requestInterceptors?: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>
    requestInterceptorsCatch?: (error: Error) => void
    responseInterceptors?: (res: AxiosResponse<BaseResponse>) => Promise<IModels.Base | void>
    responseInterceptorsCatch?: <T = any>(error: AxiosError<T>) => void
  }

  /**
   * @description Back end api base result structure
   */
  export interface BaseResponse<T = IModels.Base> {
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
  export interface BaseListResponse<T = IModels.Base> {
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
  export type BaseSortParams<T = IModels.Base> = {
    field: keyof T
    order: DataTableSortOrder
    priority: number
  }[]

  /**
   * @description base page params
   */
  export interface BasePageParams {
    page: number
    pageSize: number
  }

  /**
   * @description Back list api params structure
   */
  export interface BaseListParams<T = IModels.Base> {
    /**
     * @description query object
     */
    query?: T

    /**
     * @description sort object
     */
    sort?: BaseSortParams<T>

    /**
     * @description pagination object
     */
    page?: BasePageParams
  }
}
