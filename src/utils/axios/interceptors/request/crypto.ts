import { aesGcmEncryptSplit, arrayBufferToBase64, exportAesKeyRaw, generateAes256Key, importRsaPublicKey, rsaOaepEncrypt } from '@/utils/crypto/shared'

interface CipherEnvelope {
  enc: 'AES_256_GCM'
  key: string // base64(RSA-OAEP encrypted AES key)
  iv: string // base64(12-byte IV)
  ct: string // base64(ciphertext)
  tag: string // base64(16-byte GCM tag)
}

export async function encryptRequestValue(value: string) {
  // 1. Generate AES-256 key
  const aesKey = await generateAes256Key()

  // 2. AES-GCM encrypt plaintext to get IV, ciphertext and tag
  const { iv, ciphertext, tag } = await aesGcmEncryptSplit(aesKey, value)

  // 3. Export raw AES key and encrypt with RSA
  const rawAesKey = await exportAesKeyRaw(aesKey)
  const appStoreSecurity = useAppStoreSecurity()
  const serverRsaPubKey = await appStoreSecurity.getServerRsaPubKey()
  const rsaPublicKey = await importRsaPublicKey(serverRsaPubKey)
  const encryptedAesKey = await rsaOaepEncrypt(rsaPublicKey, rawAesKey)

  // 4. Assemble encryption envelope
  const envelope: CipherEnvelope = {
    enc: 'AES_256_GCM',
    key: arrayBufferToBase64(encryptedAesKey),
    iv: arrayBufferToBase64(iv.buffer),
    ct: arrayBufferToBase64(ciphertext.buffer),
    tag: arrayBufferToBase64(tag.buffer),
  }

  return btoa(JSON.stringify(envelope))
}
