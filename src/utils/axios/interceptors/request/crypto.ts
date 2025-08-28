import { aesGcmEncryptSplit, arrayBufferToBase64, exportAesKeyRaw, generateAes256Key, importRsaPublicKey, rsaOaepEncrypt } from '@/utils/crypto/shared'

interface CipherEnvelope {
  enc: 'AES_256_GCM'
  key: string // base64(RSA-OAEP encrypted AES key)
  iv: string // base64(12-byte IV)
  ct: string // base64(ciphertext)
  tag: string // base64(16-byte GCM tag)
}

// TODO _autoEncryptRequestData
export async function encryptRequestValueToEnvelope(value: string): Promise<CipherEnvelope> {
  // 1. 生成AES-256密钥
  const aesKey = await generateAes256Key()

  // 2. AES-GCM加密明文，获取IV、密文、标签
  const { iv, ciphertext, tag } = await aesGcmEncryptSplit(aesKey, value)

  // 3. 导出AES原始密钥并使用RSA加密
  const rawAesKey = await exportAesKeyRaw(aesKey)
  const appStoreSecurity = useAppStoreSecurity()
  const serverRsaPubKey = await appStoreSecurity.getServerRsaPubKey()
  const rsaPublicKey = await importRsaPublicKey(serverRsaPubKey)
  const encryptedAesKey = await rsaOaepEncrypt(rsaPublicKey, rawAesKey)

  // 4. 组装加密信封
  return {
    enc: 'AES_256_GCM',
    key: arrayBufferToBase64(encryptedAesKey),
    iv: arrayBufferToBase64(iv.buffer),
    ct: arrayBufferToBase64(ciphertext.buffer),
    tag: arrayBufferToBase64(tag.buffer),
  }
}
