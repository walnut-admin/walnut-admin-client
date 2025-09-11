import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const authPhone = {
  AUTH_PHONE: '/auth/phone',
  AUTH_EMAIL_TEXT_MESSAGE: '/auth/phone/send',
} as const

/**
 * @description auth with text message
 */
export function authWithPhoneNumberAPI(data: IRequestPayload.Auth.Phone.Verify) {
  return AppAxios.post<IResponseData.Auth.TokenPayload>({
    url: authPhone.AUTH_PHONE,
    data,
  })
}

/**
 * @description send verify code text message
 */
export function sendAuthTextMsgAPI(data: IRequestPayload.Auth.Phone.Send) {
  return AppAxios.post<boolean>({
    url: authPhone.AUTH_EMAIL_TEXT_MESSAGE,
    data,
  })
}
