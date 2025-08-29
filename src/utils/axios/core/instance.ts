import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

import axios from 'axios'

export class Axios {
  private readonly instance: AxiosInstance

  constructor(options: IAxiosConfig) {
    this.instance = axios.create(options.originalConfig)
    this.createInterceptors(options.transformers)
  }

  /**
   * @description create request/response interceptors
   */
  private createInterceptors(transform: IAxiosTransformers) {
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

  /**
   * @description create request interceptors
   */
  private createRequestInterceptor(interceptor: any, error: any) {
    this.instance.interceptors.request.use(interceptor, error)
  }

  /**
   * @description create response interceptors
   */
  private createResponseInterceptor(interceptor: any, error: any) {
    this.instance.interceptors.response.use(interceptor, error)
  }

  /**
   * @description base request method
   */
  request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<T, T>(config)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * @description Axios Cancel Request
   */
  isCancel(err: AxiosError) {
    return axios.isCancel(err)
  }

  /**
   * @description Axios Get
   */
  get<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'GET' })
  }

  /**
   * @description Axios Post
   */
  post<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'POST' })
  }

  /**
   * @description Axios Put
   */
  put<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'PUT' })
  }

  /**
   * @description Axios Patch
   */
  patch<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'PATCH' })
  }

  /**
   * @description Axios Delete
   */
  delete<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
}
