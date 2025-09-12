import { SingletonPromise } from '@/utils/queue'

const capJSQueue = new SingletonPromise<string>()

export function SingletonPromiseCapJSToken() {
  const compStoreCapJS = useStoreCompCapJS()

  return capJSQueue.run(async () => {
    return await compStoreCapJS.refreshCapJSToken()
  })
}
