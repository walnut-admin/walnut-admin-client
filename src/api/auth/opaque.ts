import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const authOpaque = {
  LOGIN_START: '/auth/opaque/user/login/start',
  LOGIN_FINISH: '/auth/opaque/user/login/finish',
  CHANGE_PASSWORD_START: '/auth/opaque/user/change-password/start',
  CHANGE_PASSWORD_FINISH: '/auth/opaque/user/change-password/finish',
} as const

/**
 * @description opaque login start
 */
export function opaqueLoginStartAPI(data: IRequestPayload.Auth.Opaque.Login.Start) {
  return AppAxios.post<string>({
    url: authOpaque.LOGIN_START,
    data,
  })
}

/**
 * @description opaque login finish
 */
export function opaqueLoginFinishAPI(data: IRequestPayload.Auth.Opaque.Login.Finish) {
  return AppAxios.post<IResponseData.Auth.TokenPayload>({
    url: authOpaque.LOGIN_FINISH,
    data,
  })
}

/**
 * @description opaque change password start
 */
export function opaqueChangePasswordStartAPI(data: IRequestPayload.Auth.Opaque.Register.Start) {
  return AppAxios.post<string>({
    url: authOpaque.CHANGE_PASSWORD_START,
    data,
  })
}

/**
 * @description opaque change password finish
 */
export function opaqueChangePasswordFinishAPI(data: IRequestPayload.Auth.Opaque.Register.Finish) {
  return AppAxios.post<boolean>({
    url: authOpaque.CHANGE_PASSWORD_FINISH,
    data,
  })
}
