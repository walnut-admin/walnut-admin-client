import type { IModels } from '../models'
import type { IRequestPayload } from '../request'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const userAPI = new BaseAPI<IModels.SystemUser>({
  model: 'system',
  section: 'user',
})

const systemUser = {
  UPDATE_PASSWORD_START: '/auth/opaque/admin/password/update/start',
  UPDATE_PASSWORD_FINISH: '/auth/opaque/admin/password/update/finish',
  CLEAR_PASSWORD: '/auth/opaque/admin/password/clear',
} as const

/**
 * @description clear password
 */
export function clearPasswordAPI(data: { _id: string }) {
  return AppAxios.post<boolean>({
    url: systemUser.CLEAR_PASSWORD,
    data,
  })
}

/**
 * @description update password start
 */
export function updatePasswordStartAPI(data: IRequestPayload.Auth.Opaque.Admin.UpdatePasswordStart) {
  return AppAxios.post<string>({
    url: systemUser.UPDATE_PASSWORD_START,
    data,
  })
}

/**
 * @description update password finish
 */
export function updatePasswordFinishAPI(data: IRequestPayload.Auth.Opaque.Admin.UpdatePasswordFinish) {
  return AppAxios.post<boolean>({
    url: systemUser.UPDATE_PASSWORD_FINISH,
    data,
  })
}
