import { SingletonPromise } from '@/utils/queue'

const appStoreSecurity = useAppStoreSecurity()
const signQueue = new SingletonPromise<string>()

export function SingletonPromiseSign() {
  return signQueue.run(async () => {
    return await appStoreSecurity.getSignAesKey()
  })
}
