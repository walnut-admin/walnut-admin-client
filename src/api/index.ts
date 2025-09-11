import type { AxiosRequestConfig } from 'axios'
import type { IResponseData } from './response'
import { AppAxios } from '@/utils/axios'

export function HelloAPI(config: AxiosRequestConfig) {
  return AppAxios.get<string>(
    {
      url: '',
      ...config,
    },
  )
}

export function HelloWithTokenAPI(config: AxiosRequestConfig) {
  return AppAxios.get<string>(
    {
      url: '/auth',
      ...config,
    },
  )
}

export function BackendDepsAPI() {
  return AppAxios.get<IResponseData.BackendDeps>(
    {
      url: '/deps',
    },
  )
}
