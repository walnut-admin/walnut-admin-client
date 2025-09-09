import { AppAxios } from '@/utils/axios'

/**
 * @description get ali oss sts token from backend
 */
export function getAliSTSTokenAPI() {
  return AppAxios.get<{
    accessKeyId: string
    accessKeySecret: string
    stsToken: string
    region: string
    bucket: string
  }>(
    {
      url: '/shared/ali/sts',
      _autoDecryptResponseData: ['accessKeyId', 'accessKeySecret', 'stsToken'],
    },
  )
}
