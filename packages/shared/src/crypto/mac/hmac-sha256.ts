import { arrayBufferToHex } from '../transformer'

/**
 * @description HMAC-SHA256
 */
export async function hmacSha256(
  message: string,
  key: ArrayBuffer | string,
): Promise<string> {
  // 1. transform message to ArrayBuffer
  const messageBytes = new TextEncoder().encode(message)

  // 2. handle key
  let keyBytes: ArrayBuffer
  if (typeof key === 'string') {
    keyBytes = new TextEncoder().encode(key).buffer
  }
  else {
    keyBytes = key
  }

  // 3. import key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  // 4. calculate HMAC
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes)

  // 5. transform to hex string (consistent with CryptoJS's .toString())
  return arrayBufferToHex(signature)
}
