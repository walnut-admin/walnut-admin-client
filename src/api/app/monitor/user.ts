import type { IModels } from '@/api/models'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../../base'

export const monitorUserAPI = new BaseAPI<IModels.AppMonitorUser>({
  model: 'app',
  section: 'monitor/user',
})

export function forceQuitAPI(id: string) {
  return AppAxios.delete({
    url: `/app/monitor/user/force-quit/${id}`,
  })
}
