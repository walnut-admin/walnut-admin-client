import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const mfaAPI = {
  status: '/auth/mfa/status',
  verify: '/auth/mfa/verify',

  totpGenerate: '/system/user/mfa/totp/generate',
  totpVerified: '/system/user/mfa/totp/verify',
  totpBind: '/system/user/mfa/totp/bind',
  totpUnbind: '/system/user/mfa/totp/unbind',
  totpStatus: '/system/user/mfa/totp/status',

  webauthnRegisterOptions: '/system/user/mfa/webauthn/register/options',
  webauthnRegisterVerify: '/system/user/mfa/webauthn/register/verify',
  webauthnAuthenticateOptions: '/system/user/mfa/webauthn/authenticate/options',
  webauthnAuthenticateVerify: '/system/user/mfa/webauthn/authenticate/verify',
} as const

/**
 * @description get mfa status
 */
export function authMfaStatusAPI() {
  return AppAxios.get<IResponseData.Auth.MFA.AvailableMethods>({
    url: mfaAPI.status,
  })
}

/**
 * @description verify mfa status
 */
export function authMfaVerifyAPI(trusted: boolean) {
  return AppAxios.post<string>({
    url: mfaAPI.verify,
    data: {
      trusted,
    },
  })
}

/**
 * @description generate totp
 */
export function authMfaTotpGenerateAPI(data: IRequestPayload.Auth.MFA.Totp.Generate) {
  return AppAxios.post<IResponseData.Auth.MFA.Totp.Generate>({
    url: mfaAPI.totpGenerate,
    data,
  })
}

/**
 * @description verify totp
 */
export function authMfaTotpVerifyAPI(data: IRequestPayload.Auth.MFA.Totp.Verify) {
  return AppAxios.post<string>({
    url: mfaAPI.totpVerified,
    data,
  })
}

/**
 * @description bind totp
 */
export function authMfaTotpBindAPI(data: IRequestPayload.Auth.MFA.Totp.Bind) {
  return AppAxios.post<IResponseData.Auth.MFA.Totp.Bind>({
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

/**
 * @description update totp status
 */
export function authMfaTotpUpdateStatusAPI(status: boolean) {
  return AppAxios.put<boolean>({
    url: mfaAPI.totpStatus,
    data: {
      status,
    },
  })
}

/**
 * @description get webauthn register options
 */
export function authMfaWebauthnRegisterOptionsAPI(data: IRequestPayload.Auth.MFA.Webauthn.RegisterOptions) {
  return AppAxios.post<IResponseData.Auth.MFA.Webauthn.RegisterOptions>({
    url: mfaAPI.webauthnRegisterOptions,
    data,
  })
}

/**
 * @description verify webauthn register
 */
export function authMfaWebauthnRegisterVerifyAPI(data: IRequestPayload.Auth.MFA.Webauthn.RegisterVerify) {
  return AppAxios.post<boolean>({
    url: mfaAPI.webauthnRegisterVerify,
    data,
  })
}

/**
 * @description get webauthn authenticate options
 */
export function authMfaWebauthnAuthenticateOptionsAPI() {
  return AppAxios.post<IResponseData.Auth.MFA.Webauthn.AuthenticateOptions>({
    url: mfaAPI.webauthnAuthenticateOptions,
  })
}

/**
 * @description verify webauthn authenticate
 */
export function authMfaWebauthnAuthenticateVerifyAPI(data: IRequestPayload.Auth.MFA.Webauthn.AuthenticateVerify) {
  return AppAxios.post<string>({
    url: mfaAPI.webauthnAuthenticateVerify,
    data,
  })
}
