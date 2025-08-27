import { AppAxios } from '@/utils/axios'

/**
 * @description sign initial
 */
export async function signInitialAPI(rsaPubKey: string) {
  return await AppAxios.post({
    url: '/security/sign/initial',
    data: {
      rsaPubKey,
    },
  })
}

/**
 * @description sign aes key
 */
export async function signAesKeyAPI() {
  return await AppAxios.post<AppPayloadAuth.SignSessionKeyPayload>({
    url: `/security/sign/aes-key`,
  })
}
