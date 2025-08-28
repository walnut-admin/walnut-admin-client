import { SingletonPromise } from '@/utils/queue'

const appStoreCapJSToken = useAppStoreCapJSToken()
const capJSQueue = new SingletonPromise<string>()

export function SingletonPromiseCapJSToken() {
  return capJSQueue.run(async () => {
    return await appStoreCapJSToken.refreshCapJSToken()
  })
}
