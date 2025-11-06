import { SingletonPromise } from '@/utils/queue'

const appStoreSecurity = useAppStoreSecurity()
const rsaPubKeyNotFoundQueue = new SingletonPromise<void>()

export function SingletonPromiseRsaPubKeyNotFound() {
  return rsaPubKeyNotFoundQueue.run(async () => {
    return await appStoreSecurity.sendRsaPubKeyToServer(false)
  })
}
