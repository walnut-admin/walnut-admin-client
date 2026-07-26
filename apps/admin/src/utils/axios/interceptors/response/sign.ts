import { SingletonPromise } from '@walnut/shared/queue'

const appStoreSecurity = useAppStoreSecurity()
const signQueue = new SingletonPromise<string | null>()

export function SingletonPromiseSign() {
  return signQueue.run(async () => {
    return await appStoreSecurity.getSignAesKey()
  })
}
