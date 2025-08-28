import { arrayBufferToBase64, base64ToArrayBuffer } from '../shared'

export async function aesGcmEncrypt(
  aesKey: CryptoKey,
  plain: string,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const buf = new TextEncoder().encode(plain)
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, buf)

  const payload = new Uint8Array(iv.byteLength + ct.byteLength)
  payload.set(iv, 0)
  payload.set(new Uint8Array(ct), iv.byteLength)

  return arrayBufferToBase64(payload.buffer)
}

export async function aesGcmDecrypt(
  aesKey: CryptoKey,
  encoded: string,
): Promise<string | null> {
  try {
    const data = base64ToArrayBuffer(encoded)
    const iv = data.slice(0, 12)
    const ct = data.slice(12)
    const buf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      ct,
    )
    return new TextDecoder().decode(buf)
  }
  catch {
    return null
  }
}
