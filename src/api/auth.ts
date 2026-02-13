import type { IResponseData } from './response'
import { AppAxios } from '@/utils/axios'

const Auth = {
  SIGNOUT: '/auth/signout',
  REFRESH_TOKEN: '/auth/refresh',
  PERMISSION: '/auth/permissions',
  KEYS: '/auth/keys',
} as const

/**
 * @description Sign out
 */
export function signoutAPI() {
  return AppAxios.post({
    url: Auth.SIGNOUT,
  })
}

/**
 * @description Refresh accessToken use refreshToken
 */
export function refreshTokenAPI() {
  return AppAxios.post<IResponseData.Auth.TokenPayload>({
    url: Auth.REFRESH_TOKEN,
  })
}

/**
 * @description Signin user permissions api
 */
export function getPermissionsAPI() {
  return AppAxios.get<IResponseData.Auth.Permissions>({
    url: Auth.PERMISSION,
  })
}

/**
 * @description get baidu ak from backend
 */
export function getBaiduKeyAPI() {
  return AppAxios.get<IResponseData.Auth.Keys>(
    {
      url: Auth.KEYS,
      _autoDecryptResponseData: ['B'],
      _cache: true,
    },
  )
}
