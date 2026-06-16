import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import type { AxiosConfig, AxiosTransformers } from './types'
import axios from 'axios'

export class Axios {
  private readonly instance: AxiosInstance

  constructor(options: AxiosConfig) {
    this.instance = axios.create(options.originalConfig)
    this.createInterceptors(options.transformers)
  }

  private createInterceptors(transform: AxiosTransformers) {
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    this.createRequestInterceptor(requestInterceptors, requestInterceptorsCatch)
    this.createResponseInterceptor(
      responseInterceptors,
      responseInterceptorsCatch,
    )
  }

  private createRequestInterceptor(interceptor: any, error: any) {
    this.instance.interceptors.request.use(interceptor, error)
  }

  private createResponseInterceptor(interceptor: any, error: any) {
    this.instance.interceptors.response.use(interceptor, error)
  }

  request<T = any, D = any>(
    config: AxiosRequestConfig<D>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<T, T>(config)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  isCancel(err: AxiosError) {
    return axios.isCancel(err)
  }

  get<T, D = any>(config: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, method: 'GET' })
  }

  post<T, D = any>(config: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, method: 'POST' })
  }

  put<T, D = any>(config: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, method: 'PUT' })
  }

  patch<T, D = any>(config: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, method: 'PATCH' })
  }

  delete<T, D = any>(config: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, method: 'DELETE' })
  }
}
