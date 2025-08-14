import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const deletedAPI = new BaseAPI<AppSystemDeleted>({
  model: 'system',
  section: 'deleted',
})

namespace NSAppSystemDeletedAPI {
  export type RecoverReq = Pick<AppBaseModel, '_id'> & Pick<AppSystemDeleted, 'deletedId'>
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
