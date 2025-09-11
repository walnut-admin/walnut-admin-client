import { SingletonPromise } from '@/utils/queue'

const compStoreCapJS = useStoreCompCapJS()
const capJSQueue = new SingletonPromise<string>()

export function SingletonPromiseCapJSToken() {
  return capJSQueue.run(async () => {
    return await compStoreCapJS.refreshCapJSToken()
  })
}
