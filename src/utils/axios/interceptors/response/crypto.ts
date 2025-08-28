import { aesGcmDecryptSplit, importAesKeyRaw, importRsaPrivateKey, rsaOaepDecrypt } from '@/utils/crypto/shared'

export async function decryptResponseValue(encryptedBase64: string): Promise<string> {
  try {
    // 1. Parse encrypted payload
    const payloadStr = atob(encryptedBase64)
    const payload = JSON.parse(payloadStr)
    const ct = Uint8Array.from(atob(payload.cipher), c => c.charCodeAt(0))
    const encKey = Uint8Array.from(atob(payload.key), c => c.charCodeAt(0))

    // 2. Import RSA private key and decrypt to get AES-related data
    const appSecurity = useAppStoreSecurity()
    const clientRsaPrivKey = appSecurity.getClientPrivKey
    const rsaPrivateKey = await importRsaPrivateKey(clientRsaPrivKey)
    const keyBlobBuf = await rsaOaepDecrypt(rsaPrivateKey, encKey.buffer)
    const keyBlob = new Uint8Array(keyBlobBuf)

    // 3. Split AES key, IV, and tag
    const aesKeyBytes = keyBlob.slice(0, 32) // 256-bit AES key
    const iv = keyBlob.slice(32, 44) // 12-byte IV
    const tag = keyBlob.slice(44, 60) // 16-byte tag

    // 4. Import AES key and decrypt
    const aesKey = await importAesKeyRaw(aesKeyBytes.buffer)
    return aesGcmDecryptSplit(aesKey, iv, ct, tag)
  }
  catch (error) {
    console.error(`Failed to decrypt response value`, error)
    return encryptedBase64
  }
}
