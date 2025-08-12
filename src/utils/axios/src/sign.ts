import CryptoJS from 'crypto-js'

export function buildSign(params: Record<string, any>, certPayload: AppPayloadAuth.ClientCert) {
  const ua = navigator.userAgent

  const flatternObj = objectToPaths(params)

  const sorted = Object.keys(flatternObj)
    .sort()
    .map(k => `${k}=${flatternObj[k]}`)
    .join('&')

  if (!certPayload)
    return

  const raw = `${sorted}&serial=${certPayload.server_sn}&ua=${ua}`

  const sign = CryptoJS.HmacSHA256(raw, certPayload.secret).toString()

  return sign
}
