import type { IModels } from '../models'
import { BaseAPI } from '../base'

export const langAPI = new BaseAPI<IModels.SystemLang>({
  model: 'system',
  section: 'lang',
})
