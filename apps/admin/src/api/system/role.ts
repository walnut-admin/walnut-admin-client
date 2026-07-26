import type { IModels } from '../models'
import { BaseAPI } from '../base'

export const roleAPI = new BaseAPI<IModels.SystemRole>({
  model: 'system',
  section: 'role',
})
