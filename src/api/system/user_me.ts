import type { IModels } from '../models'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const systemUserMe = {
  SWITCH_ROLE: '/system/user/me/role/switch',
  GET_PROFILE: '/system/user/me/profile',
  UPDATE_PROFILE: '/system/user/me/profile',
  GET_SECURITY_TAB_1_STATUS: '/system/user/me/security-tab1',
  GET_SECURITY_TAB_2_STATUS: '/system/user/me/security-tab2',
} as const

/**
 * @description switch role
 */
export function switchRoleAPI(roleId: string) {
  return AppAxios.patch<boolean>({
    url: `${systemUserMe.SWITCH_ROLE}/${roleId}`,
  })
}

/**
 * @description Signin user detail info api
 */
export function getUserProfileAPI() {
  return AppAxios.get<IResponseData.Auth.Profile>({
    url: systemUserMe.GET_PROFILE,
  })
}

/**
 * @description update profile
 */
export function updateProfileAPI(data: IModels.SystemUser) {
  return AppAxios.put<boolean>({
    url: systemUserMe.UPDATE_PROFILE,
    data,
  })
}

/**
 * @description get user center security tab 1 status
 */
export function getSecurityTab1StatusAPI() {
  return AppAxios.get<IResponseData.Me.Security.Tab1Status>({
    url: systemUserMe.GET_SECURITY_TAB_1_STATUS,
  })
}

/**
 * @description get user center security tab 2 status
 */
export function getSecurityTab2StatusAPI() {
  return AppAxios.get<IResponseData.Me.Security.Tab2Status>({
    url: systemUserMe.GET_SECURITY_TAB_2_STATUS,
  })
}
