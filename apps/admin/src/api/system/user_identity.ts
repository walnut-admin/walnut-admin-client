import type { IModels } from '../models'
import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const systemUserIdentity = {
  CHECK: '/system/user/identity/check',
  BIND: '/system/user/identity/bind',
  UNBIND: '/system/user/identity/unbind',
  SEND_CODE: '/system/user/identity/send-code',
  STATUS: '/system/user/identity/status',
  VERIFY: '/system/user/identity/verify',
  GET_SECURITY_TAB_1_STATUS: '/system/user/identity/status',
} as const

/**
 * @description get user center security tab 1 status
 */
export function getSecurityTab1StatusAPI2(purpose: IModels.ISystemUserIdentityPurpose) {
  return AppAxios.get<IResponseData.Me.Security.Tab1Status>({
    url: `${systemUserIdentity.GET_SECURITY_TAB_1_STATUS}/${purpose}`,
  })
}

/**
 * @description check user identity
 */
export function checkUserIdentityAPI(data: IRequestPayload.System.UserIdentity.Check) {
  return AppAxios.post<boolean>({
    url: `${systemUserIdentity.CHECK}/${data.type}/${data.purpose}`,
    data: {
      identifier: data.identifier,
    },
  })
}

/**
 * @description bind user identity
 */
export function bindUserIdentityAPI(data: IRequestPayload.System.UserIdentity.Bind) {
  return AppAxios.post<boolean>({
    url: `${systemUserIdentity.BIND}/${data.type}/${data.purpose}`,
    data: {
      identifier: data.identifier,
      verifyCode: data.verifyCode,
      setAsSecurity: data.setAsSecurity,
    },
  })
}

/**
 * @description unbind user identity
 */
export function unBindUserIdentityAPI(type: IModels.ISystemUserIdentityType, purpose: IModels.ISystemUserIdentityPurpose) {
  return AppAxios.delete<boolean>({
    url: `${systemUserIdentity.UNBIND}/${type}/${purpose}`,
  })
}

/**
  @description send code with otp
 */
export function sendCodeForVerifyAPI(type: IModels.ISystemUserIdentityType, purpose: IModels.ISystemUserIdentityPurpose) {
  return AppAxios.post<boolean>({
    url: `${systemUserIdentity.SEND_CODE}/${type}/${purpose}`,
  })
}

/**
 * @description update user identity status
 */
export function updateUserIdentityStatusAPI(data: IRequestPayload.System.UserIdentity.Status) {
  return AppAxios.put<boolean>({
    url: `${systemUserIdentity.STATUS}/${data.type}/${data.purpose}`,
    data: {
      status: data.status,
    },
  })
}

/**
 * @description verify user identity
 */
export function verifyUserIdentityAPI(data: IRequestPayload.System.UserIdentity.Verify) {
  return AppAxios.post<boolean>({
    url: `${systemUserIdentity.VERIFY}/${data.type}/${data.purpose}`,
    data: {
      verifyCode: data.verifyCode,
    },
  })
}
