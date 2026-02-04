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
  KICK_OUT_ALL_DEVICES: '/auth/opaque/admin/kick-out-all-devices',
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

/**
 * @description Kick out all devices for current user
 */
export function kickOutAllDevicesForAdminAPI(data: IRequestPayload.Auth.KickOutAllDevicesForAdmin) {
  return AppAxios.post({
    url: systemUser.KICK_OUT_ALL_DEVICES,
    data,
  })
}

/**
 * @description switch role
 */
export function switchRoleAPI(roleId: string) {
  return AppAxios.patch<boolean>({
    url: `/auth/role/switch/${roleId}`,
  })
}
