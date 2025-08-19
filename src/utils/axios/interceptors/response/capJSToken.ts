import { SingletonPromise } from '@/utils/queue'

const appCapJSToken = useAppStoreCapJSToken()
const capJSQueue = new SingletonPromise<string>()

export function SingletonPromiseCapJSToken() {
  return capJSQueue.run(async () => {
    return await appCapJSToken.refreshCapJSToken()
  })
}
