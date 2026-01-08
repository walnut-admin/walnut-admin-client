import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const mfaAPI = {
  availableMethods: '/auth/mfa/available-methods',
  mfaVerify: '/auth/mfa/verify',
  totpGenerate: '/system/user/mfa/totp/generate',
  totpStatus: '/system/user/mfa/totp/status',
  totpBind: '/system/user/mfa/totp/bind',
  totpUnbind: '/system/user/mfa/totp/unbind',
} as const

/**
 * @description get available mfa methods
 */
export function authMfaAvailableMethodsAPI() {
  return AppAxios.get<IResponseData.Auth.MFA.AvailableMethods>({
    url: mfaAPI.availableMethods,
  })
}

/**
 * @description verify mfa status
 */
export function authMfaVerifyAPI() {
  return AppAxios.post<string>({
    url: mfaAPI.mfaVerify,
  })
}

/**
 * @description generate totp
 */
export function authMfaTotpGenerateAPI(data: IRequestPayload.Auth.MFA.TotpGenerate) {
  return AppAxios.post<IResponseData.Auth.MFA.TotpGenerate>({
    url: mfaAPI.totpGenerate,
    data,
  })
}

/**
 * @description get totp status
 */
export function authMfaTotopStatusAPI() {
  return AppAxios.get<IResponseData.Auth.MFA.TotpStatus>({
    url: mfaAPI.totpStatus,
  })
}

/**
 * @description bind totp
 */
export function authMfaTotpBindAPI(data: IRequestPayload.Auth.MFA.TotpBind) {
  return AppAxios.post<IResponseData.Auth.MFA.TotpBind>({
    url: mfaAPI.totpBind,
    data,
  })
}

/**
 * @description unbind totp
 */
export function authMfaTotpUnbindAPI() {
  return AppAxios.delete<boolean>({
    url: mfaAPI.totpUnbind,
  })
}
