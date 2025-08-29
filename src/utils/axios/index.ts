import { originalConfig } from './core/config'
import { Axios } from './core/instance'
import { AxiosTransform } from './interceptors'

// app axios instance
export const AppAxios = new Axios({
  originalConfig,

  transformers: AxiosTransform,
})
