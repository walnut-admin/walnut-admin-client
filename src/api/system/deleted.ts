import type { IModels } from '../models'
import type { IRequestPayload } from '../request'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const deletedAPI = new BaseAPI<IModels.SystemDeleted>({
  model: 'system',
  section: 'deleted',
})

/**
 * @description recover for manage
 */
export function recoverAPI(data: IRequestPayload.System.Deleted.Recover) {
  return AppAxios.post<boolean>(
    {
      url: '/system/deleted/recover',
      data,
    },
  )
}
