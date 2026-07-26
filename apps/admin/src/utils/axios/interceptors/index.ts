import type { AxiosTransformers } from '@walnut/axios/types'
import { requestInterceptorsCatch } from './request/catch'
import { requestInterceptors } from './request/interceptor'
import { responseInterceptorsCatch } from './response/catch'
import { responseInterceptors } from './response/interceptor'

// custom transform for req and res interceptors
export const AxiosTransform: AxiosTransformers = {
  requestInterceptors,
  requestInterceptorsCatch,
  responseInterceptors,
  responseInterceptorsCatch,
}
