import { useAppStoreSign } from '@/store/modules/app/app-sign'
import { SingletonPromise } from '@/utils/queue'

const appSign = useAppStoreSign()
const signQueue = new SingletonPromise<string>()

export function SingletonPromiseSign() {
  return signQueue.run(async () => {
    return await appSign.refreshAesKey()
  })
}
