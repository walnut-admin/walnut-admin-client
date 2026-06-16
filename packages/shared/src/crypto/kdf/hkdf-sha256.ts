/**
 * @description HKDF-SHA256
 */
export async function hkdfSha256(
  ikm: ArrayBuffer,
  salt: ArrayBuffer,
  info: ArrayBuffer,
  length: number,
): Promise<ArrayBuffer> {
  // 1. import IKM as CryptoKey
  const key = await crypto.subtle.importKey(
    'raw',
    ikm,
    { name: 'HKDF' },
    false,
    ['deriveBits'],
  )

  // 2. use Web Crypto API to derive key
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt,
      info,
    },
    key,
    length * 8, // convert to bits
  )

  return derivedBits
}
