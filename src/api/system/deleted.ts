import type { IModels } from '../models'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const deletedAPI = new BaseAPI<IModels.SystemDeleted>({
  model: 'system',
  section: 'deleted',
})

namespace NSAppSystemDeletedAPI {
  export type RecoverReq = Pick<IModels.Base, '_id'> & Pick<IModels.SystemDeleted, 'deletedId'>
}

/**
 * @description recover for manage
 */
export function recoverAPI(data: NSAppSystemDeletedAPI.RecoverReq) {
  return AppAxios.post<boolean>(
    {
      url: '/system/deleted/recover',
      data,
    },
  )
}
