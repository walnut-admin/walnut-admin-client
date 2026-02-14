import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

const authOTP = {
  AUTH_OTP_SEND: '/auth/otp/send',
  AUTH_OTP_VERIFY: '/auth/otp/verify',
} as const

/**
 * @description auth with otp
 */
export function verifyWithOTPAPI(data: IRequestPayload.Auth.OTP.Verify) {
  return AppAxios.post<IResponseData.Auth.TokenPayload>({
    url: authOTP.AUTH_OTP_VERIFY,
    data,
  })
}

/**
 * @description send verify code email
 */
export function sendWithOTPAPI(data: IRequestPayload.Auth.OTP.Send) {
  return AppAxios.post<boolean>({
    url: authOTP.AUTH_OTP_SEND,
    data,
  })
}
