import { SingletonPromise } from '@/utils/queue'

const appSign = useAppStoreSecurity()
const signQueue = new SingletonPromise<string>()

export function SingletonPromiseSign() {
  return signQueue.run(async () => {
    return await appSign.getSignAesKey()
  })
}
