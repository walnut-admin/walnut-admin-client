import type { IModels } from '@/api/models'
import { BaseAPI } from '../../base'

export const monitorCacheAPI = new BaseAPI<IModels.AppMonitorCache>({
  model: 'app',
  section: 'monitor/cache',
})
