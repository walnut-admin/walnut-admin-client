import type { TreeNodeItem } from 'easy-fns-ts'
import type { RouteRecordRaw } from 'vue-router'
import type { IModels } from './models'
import type { IStoreApp } from '@/store/types'
import { AppAxios } from '@/utils/axios'

const Auth = {
  PWD: '/auth/pwd',

  SIGNOUT: '/auth/signout',

  REFRESH_TOKEN: '/auth/refresh',

  PERMISSION: '/auth/permissions',
  PROFILE: '/auth/profile',
  KEYS: '/auth/keys',
} as const

/**
 * @description auth with pwd
 */
export function authWithPwdAPI(data: AppPayloadAuth.Password) {
  return AppAxios.post<AppPayloadAuth.TokenPayload>(
    {
      url: Auth.PWD,
      data,
      _autoEncryptRequestData: ['password'],
    },
  )
}

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
  return AppAxios.post<{ accessToken: string }>({
    url: Auth.REFRESH_TOKEN,
  })
}

/**
 * @description Signin user permissions api
 */
export function getPermissionsAPI() {
  return AppAxios.get<{
    permissionMenuTree: TreeNodeItem<IModels.SystemMenu>[]
    permissionRouteTree: RouteRecordRaw[]
    permissionStrings: string[]
    keepAliveNames: string[]
    indexMenuName: string
    affixedTabs: IStoreApp.Tab.Item[]
    internalIframeList: { name: string, url: string, cache: boolean }[]
  }>({
    url: Auth.PERMISSION,
  })
}

/**
 * @description Signin user detail info api
 */
export function getUserInfoAPI() {
  return AppAxios.get<{ user: IModels.SystemUser, roleNames: string[] }>({
    url: Auth.PROFILE,
  })
}

/**
 * @description get baidu ak from backend
 */
export function getBaiduKeyAPI() {
  return AppAxios.get<{
    B?: string
  }>(
    {
      url: Auth.KEYS,
      _autoDecryptResponseData: ['B'],
      _cache: true,
    },
  )
}
