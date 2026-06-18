export {}

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
