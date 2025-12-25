import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const authOpaque = {
  AUTH_OPAQUE_LOGIN_START: '/auth/opaque/login/start',
  AUTH_OPAQUE_LOGIN_FINISH: '/auth/opaque/login/finish',
} as const

/**
 * @description opaque login start
 */
export function opaqueLoginStartAPI(data: IRequestPayload.Auth.Opaque.Start) {
  return AppAxios.post<string>({
    url: authOpaque.AUTH_OPAQUE_LOGIN_START,
    data,
  })
}

/**
 * @description opaque login finish
 */
export function opaqueLoginFinishAPI(data: IRequestPayload.Auth.Opaque.Finish) {
  return AppAxios.post<IResponseData.Auth.TokenPayload>({
    url: authOpaque.AUTH_OPAQUE_LOGIN_FINISH,
    data,
  })
}
