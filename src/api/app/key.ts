import { AppAxios } from '@/utils/axios'

/**
 * @description get backend url key, used for request data encryption
 */
export async function urlKeyAPI() {
  return await AppAxios.get<{ keyB64: string }>({
    url: '/app/key/current/AES_KEY_URL',
  })
}
