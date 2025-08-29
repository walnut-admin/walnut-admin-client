import type { AxiosResponse } from 'axios'
import { SingletonPromise } from '@/utils/queue'

const appStoreSecurity = useAppStoreSecurity()
const capJSQueue = new SingletonPromise<string>()

export function SingletonPromiseRsaDecryptFailed(res: AxiosResponse<WalnutBaseResponseStructure<AppBaseModel>, any>) {
  return capJSQueue.run(async () => {
    // clear server rsa pub key
    appStoreSecurity.clearServerRsaPubKey()

    const newRsaPubKey = await appStoreSecurity.getServerRsaPubKey()

    // put back original post data
    res.config.data = res.config._plainData

    return newRsaPubKey
  })
}
