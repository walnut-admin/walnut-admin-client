import { objectToPaths } from '@/utils/shared'
import CryptoJS from 'crypto-js'

export function buildSign(params: Record<string, any>, serverSn: string, secret: string) {
  const ua = navigator.userAgent

  const flatternObj = objectToPaths(params)

  const sorted = Object.keys(flatternObj)
    .sort()
    .map(k => `${k}=${flatternObj[k]}`)
    .join('&')

  const raw = `${sorted}&serial=${serverSn}&ua=${ua}`

  const sign = CryptoJS.HmacSHA256(raw, secret).toString()

  return sign
}
