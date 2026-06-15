import type { AxiosResponse } from 'axios'
import type { IAxios } from '../../types'
import type { IModels } from '@/api/models'
import { SingletonPromise } from '@/utils/queue'

const appStoreSecurity = useAppStoreSecurity()
const capJSQueue = new SingletonPromise<string>()

export function SingletonPromiseRsaDecryptFailed(res: AxiosResponse<IAxios.BaseResponse<IModels.Base>, any>) {
  return capJSQueue.run(async () => {
    // clear server rsa pub key
    appStoreSecurity.clearServerRsaPubKey()

    const newRsaPubKey = await appStoreSecurity.getServerRsaPubKey()

    // put back original post data
    res.config.data = res.config._plainData

    return newRsaPubKey
  })
}
