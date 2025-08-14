import type { AxiosRequestConfig } from 'axios'
import type { Recordable } from 'easy-fns-ts'
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
  return AppAxios.get<{ dependencies: Recordable, devDependencies: Recordable }>(
    {
      url: '/deps',
    },
  )
}
