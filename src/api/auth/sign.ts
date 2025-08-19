import { AppAxios } from '@/utils/axios'

/**
 * @description auth sign handshake, need to diff from AppAxios instance
 */
export async function authSignHandShakeAPI(rsaPubKey: string) {
  return await AppAxios.post({
    url: '/auth/sign/handshake',
    data: {
      rsaPubKey,
    },
  })
}

/**
 * @description auth sign session key
 */
export async function authSignSessionKeyAPI() {
  return await AppAxios.post<AppPayloadAuth.SignSessionKeyPayload>({
    url: `/auth/sign/sessionkey`,
  })
}
