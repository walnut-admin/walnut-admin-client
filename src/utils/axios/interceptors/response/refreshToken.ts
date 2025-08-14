import type { AxiosRequestConfig } from 'axios'
import { AppCoreFn1 } from '@/core'
import { getBoolean } from '@/utils/shared'
import { AppAxios } from '../..'

// flag to judge if calling refreshing token api
let isRefreshTokenRefreshing = false
// waiting queue
let refreshTokenRequestsQueue: ((token: string) => void)[] = []

const userAuth = useAppStoreUserAuth()

export function setTokenHeaderWithConfig(config: AxiosRequestConfig, token: string) {
  if (getBoolean(config._carryToken))
    config.headers!.Authorization = `Bearer ${token}`
}

export function RefreshTokenLogic(config: AxiosRequestConfig) {
  // not requesting for new access token
  if (!isRefreshTokenRefreshing) {
    isRefreshTokenRefreshing = true

    return userAuth
      .GetNewATWithRT()
      .then(async (newAccessToken) => {
        if (!newAccessToken) {
          refreshTokenRequestsQueue = []
          return
        }

        setTokenHeaderWithConfig(config, newAccessToken)

        // Authentication and Authorization should seperate, so when new access token is get, need to call permisison endpoint again
        await AppCoreFn1()

        // token already refreshed, call the waiting request
        await Promise.all(refreshTokenRequestsQueue.map(cb => cb(newAccessToken)))
        // clean queue
        refreshTokenRequestsQueue = []

        return await AppAxios.request(Object.assign(config, { _request_after_refresh_token: true }))
      })
      .finally(() => {
        refreshTokenRequestsQueue = []
        isRefreshTokenRefreshing = false
      })
  }
  else {
    // when refreshing token, return a promise that haven't called resolve
    return new Promise((resolve) => {
      // push resolve into queue, using an anonymous function to wrap it. ASAP token refresh is done, excute
      refreshTokenRequestsQueue.push((t) => {
        setTokenHeaderWithConfig(config, t)
        resolve(AppAxios.request(config))
      })
    })
  }
}
