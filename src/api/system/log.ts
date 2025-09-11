import type { IModels } from '../models'
import { BaseAPI } from '../base'

export const logOperateAPI = new BaseAPI<IModels.SystemLogOperate>({
  model: 'system',
  section: 'log/operate',
})

export const logAuthAPI = new BaseAPI<IModels.SystemLogAuth>({
  model: 'system',
  section: 'log/auth',
})
