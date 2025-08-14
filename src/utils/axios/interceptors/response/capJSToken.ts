import type { AxiosRequestConfig } from 'axios'
import { AppAxios } from '../..'

// flag to judge if calling refreshing token api
let isCapJSTokenRefreshing = false
// waiting queue
let capJSTokenRequestsQueue: ((token: string) => void)[] = []

const appCapJSToken = useAppStoreCapJSToken()

export function RefreshCapJSTokenLogic(config: AxiosRequestConfig) {
  // not requesting for new access token
  if (!isCapJSTokenRefreshing) {
    isCapJSTokenRefreshing = true

    return appCapJSToken
      .refreshCapJSToken()
      .then(async (newCapJSToken) => {
        if (!newCapJSToken) {
          capJSTokenRequestsQueue = []
          return
        }

        // token already refreshed, call the waiting request
        await Promise.all(capJSTokenRequestsQueue.map(cb => cb(newCapJSToken)))
        // clean queue
        capJSTokenRequestsQueue = []

        return await AppAxios.request(Object.assign(config, { _request_after_refresh_token: true }))
      })
      .finally(() => {
        capJSTokenRequestsQueue = []
        isCapJSTokenRefreshing = false
      })
  }
  else {
    // when refreshing token, return a promise that haven't called resolve
    return new Promise((resolve) => {
      // push resolve into queue, using an anonymous function to wrap it. ASAP token refresh is done, excute
      capJSTokenRequestsQueue.push(() => {
        resolve(AppAxios.request(config))
      })
    })
  }
}
