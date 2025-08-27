import { arrayBufferToBase64, importKeyFromPEM } from '@/utils/crypto/shared'

interface CipherEnvelope {
  enc: 'AES_256_GCM'
  key: string // base64(RSA-OAEP encrypted AES key)
  iv: string // base64(12-byte IV)
  ct: string // base64(ciphertext)
  tag: string // base64(16-byte GCM tag)
}

export async function encrpytRequestValueToEnvelope(value: string): Promise<CipherEnvelope> {
  // 1. Generate AES-256 key
  const aesKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt'],
  )

  // 2. Generate 12-byte IV
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // 3. AES-GCM encrypt the password
  const encoder = new TextEncoder()
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoder.encode(value),
  )

  // AES-GCM return format: cipherBuffer = ciphertext | tag(16 bytes)
  const cipherBytes = new Uint8Array(cipherBuffer)
  const ct = cipherBytes.slice(0, cipherBytes.length - 16)
  const tag = cipherBytes.slice(-16)

  // 4. Export raw AES key
  const rawAes = await crypto.subtle.exportKey('raw', aesKey)

  // 5. RSA-OAEP encrypt the AES key
  const appSign = useAppStoreSign()
  const rsaKey = await importKeyFromPEM(appSign.getRsaPublicKey, 'public', { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }, false, ['encrypt'])

  const encryptedAesKey = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    rsaKey,
    rawAes,
  )

  // 6. Assemble the envelope
  return {
    enc: 'AES_256_GCM',
    key: arrayBufferToBase64(encryptedAesKey),
    iv: arrayBufferToBase64(iv.buffer),
    ct: arrayBufferToBase64(ct.buffer),
    tag: arrayBufferToBase64(tag.buffer),
  }
}
