import { requestInterceptorsCatch } from './request/catch'
import { requestInterceptors } from './request/interceptor'
import { responseInterceptorsCatch } from './response/catch'
import { responseInterceptors } from './response/interceptor'

// custom transform for req and res interceptors
export const AxiosTransform: IAxiosTransformers = {
  requestInterceptors,
  requestInterceptorsCatch,
  responseInterceptors,
  responseInterceptorsCatch,
}
