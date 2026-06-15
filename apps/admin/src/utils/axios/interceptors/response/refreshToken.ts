import type { AxiosRequestConfig } from 'axios'
import { AppCoreFn1 } from '@/core'
import { SingletonPromise } from '@/utils/queue'
import { setTokenHeaderWithConfig } from '../../utils'

const userStoreAuth = useAppStoreUserAuth()
const refreshQueue = new SingletonPromise<string>()

export function SingletonPromiseRefreshToken(config: AxiosRequestConfig) {
  return refreshQueue.run(async () => {
    const newAccessToken = await userStoreAuth.GetNewATWithRT()

    setTokenHeaderWithConfig(config, newAccessToken)

    // Authentication and Authorization should seperate, so when new access token is get, need to call permisison endpoint again
    await AppCoreFn1()

    return newAccessToken
  })
}
