import { aesGcmDecryptSplit, importAesKeyRaw, importRsaPrivateKey, rsaOaepDecrypt } from '@/utils/crypto/shared'

export async function decryptResponseValue(encryptedBase64: string): Promise<string> {
  try {
    // 1. 解析加密 payload
    const payloadStr = atob(encryptedBase64)
    const payload = JSON.parse(payloadStr)
    const ct = Uint8Array.from(atob(payload.cipher), c => c.charCodeAt(0))
    const encKey = Uint8Array.from(atob(payload.key), c => c.charCodeAt(0))

    // 2. 导入RSA私钥并解密得到AES相关数据
    const appSecurity = useAppStoreSecurity()
    const clientRsaPrivKey = appSecurity.getClientPrivKey
    const rsaPrivateKey = await importRsaPrivateKey(clientRsaPrivKey)
    const keyBlobBuf = await rsaOaepDecrypt(rsaPrivateKey, encKey.buffer)
    const keyBlob = new Uint8Array(keyBlobBuf)

    // 3. 拆分AES密钥、IV、标签
    const aesKeyBytes = keyBlob.slice(0, 32) // 256位AES密钥
    const iv = keyBlob.slice(32, 44) // 12字节IV
    const tag = keyBlob.slice(44, 60) // 16字节标签

    // 4. 导入AES密钥并解密
    const aesKey = await importAesKeyRaw(aesKeyBytes.buffer)
    return aesGcmDecryptSplit(aesKey, iv, ct, tag)
  }
  catch (error) {
    console.error(`Failed to decrypt response value`, error)
    return encryptedBase64
  }
}
