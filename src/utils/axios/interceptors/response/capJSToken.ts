import { SingletonPromise } from '@/utils/queue'

const capJSRefreshQueue = new SingletonPromise<string>()
const capJSInteractionQueue = new SingletonPromise<void>()

export function SingletonPromiseCapJSInteraction() {
  const compStoreCapJS = useStoreCompCapJS()

  return capJSInteractionQueue.run(async () => {
    return await compStoreCapJS.onOpenCapModal(async () => {
      return Promise.resolve()
    })
  })
}

export function SingletonPromiseCapJSRefresh() {
  const compStoreCapJS = useStoreCompCapJS()

  return capJSRefreshQueue.run(async () => {
    return await compStoreCapJS.refreshCapJSToken()
  })
}
