import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

/**
 * @description sign initial
 */
export async function signInitialAPI(rsaPubKey: string, force = false) {
  return await AppAxios.post({
    url: '/security/sign/initial',
    data: {
      rsaPubKey,
      force,
    },
  })
}

/**
 * @description sign aes key
 */
export async function signAesKeyAPI() {
  return await AppAxios.post<IResponseData.Security.Sign.AesKey>({
    url: `/security/sign/aes-key`,
    // TODO fuck types
    _autoDecryptResponseData: ['aesKey'],
  })
}
