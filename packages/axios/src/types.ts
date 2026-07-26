import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { Recordable } from 'easy-fns-ts'

/**
 * @description Sort order for list params (framework-agnostic)
 */
export type SortOrder = 'ascend' | 'descend' | false

export interface AxiosConfig {
  originalConfig: AxiosRequestConfig
  transformers: AxiosTransformers
}

export interface AxiosTransformers<T = any> {
  requestInterceptors?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>
  requestInterceptorsCatch?: (error: Error) => void
  responseInterceptors?: (res: AxiosResponse) => Promise<T | void>
  responseInterceptorsCatch?: <E = any>(error: AxiosError<E>) => void
}

export interface BaseResponse<T = any> {
  code: number
  msg: string
  data: T
  meta?: Recordable
}

export interface BaseListResponse<T = any> {
  data: T[]
  total: number
}

export type BaseSortParams<T = any> = {
  field: keyof T
  order: SortOrder
  priority: number
}[]

export interface BasePageParams {
  page: number
  pageSize: number
}

export interface BaseListParams<T = any> {
  query?: T
  sort?: BaseSortParams<T>
  page?: BasePageParams
}

// Augment AxiosRequestConfig with custom adapter config properties
declare module 'axios' {
  interface AxiosRequestConfig<D = any, R = any> {
    _carryToken?: boolean
    _timestamp?: boolean
    _cache?: boolean
    _cache_force_update?: boolean
    _retryTimes?: number
    _throttle?: number
    _mergeRequest?: boolean
    _cancelOnRouteChange?: boolean
    _requestId?: string
    _autoDecryptResponseData?: (keyof R & string)[]
    _autoEncryptRequestData?: (keyof D & string)[]
    _encrypted?: boolean
    _plainData?: any
  }
}
