import { AppAxios } from '@/utils/axios'

const authEmail = {
  AUTH_EMAIL: '/auth/email',
  AUTH_EMAIL_SEND: '/auth/email/send',
} as const

/**
 * @description auth with email
 */
export function authWithEmailAPI(data: AppPayloadAuth.EmailAddress) {
  return AppAxios.post<AppPayloadAuth.TokenPayload>({
    url: authEmail.AUTH_EMAIL,
    data,
  })
}

/**
 * @description send verify code email
 */
export function sendAuthEmailAPI(data: Pick<AppPayloadAuth.EmailAddress, 'emailAddress'>) {
  return AppAxios.post<boolean>({
    url: authEmail.AUTH_EMAIL_SEND,
    data,
  })
}
