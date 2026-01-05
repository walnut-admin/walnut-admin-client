import type { IResponseData } from './response'
import { AppAxios } from '@/utils/axios'

const Auth = {
  SIGNOUT: '/auth/signout',
  KICK_OUT_ALL: '/auth/kick-out-all-devices',
  REFRESH_TOKEN: '/auth/refresh',
  PERMISSION: '/auth/permissions',
  PROFILE: '/auth/profile',
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
 * @description Kick out all devices
 */
export function kickOutAllDevicesAPI(type: string) {
  return AppAxios.post({
    url: `${Auth.KICK_OUT_ALL}?type=${type}`,
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
 * @description Signin user detail info api
 */
export function getUserProfileAPI() {
  return AppAxios.get<IResponseData.Auth.Profile>({
    url: Auth.PROFILE,
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
