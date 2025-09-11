import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

/**
 * @description get ali oss sts token from backend
 */
export function getAliSTSTokenAPI() {
  return AppAxios.get<IResponseData.Shared.AliStsToken>(
    {
      url: '/shared/ali/sts',
      _autoDecryptResponseData: ['accessKeyId', 'accessKeySecret', 'stsToken'],
    },
  )
}
