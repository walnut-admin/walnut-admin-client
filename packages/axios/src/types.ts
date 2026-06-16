import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface AxiosConfig {
  originalConfig: AxiosRequestConfig
  transformers: AxiosTransformers
}

export interface AxiosTransformers<T = any> {
  requestInterceptors?: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>
  requestInterceptorsCatch?: (error: Error) => void
  responseInterceptors?: (res: AxiosResponse) => Promise<T | void>
  responseInterceptorsCatch?: <E = any>(error: AxiosError<E>) => void
}
