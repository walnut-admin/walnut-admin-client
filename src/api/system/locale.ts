import type { IModels } from '../models'
import { BaseAPI } from '../base'

export const localeAPI = new BaseAPI<IModels.SystemLocale>({
  model: 'system',
  section: 'locale',
})
