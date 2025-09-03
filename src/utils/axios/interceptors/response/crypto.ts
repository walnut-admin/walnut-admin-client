import { importAesKeyRaw, importRsaPrivateKey, rsaOaepDecrypt } from '@/utils/crypto/shared'
import { aesGcmDecrypt } from '@/utils/crypto/symmetric/aes-gcm'

export async function decryptResponseValue(encryptedBase64: string): Promise<string> {
  try {
    // 1. Parse encrypted payload
    const payloadStr = atob(encryptedBase64)
    const payload = JSON.parse(payloadStr)
    const ct = Uint8Array.from(atob(payload.cipher), c => c.charCodeAt(0))
    const encKey = Uint8Array.from(atob(payload.key), c => c.charCodeAt(0))

    // 2. Import RSA private key and decrypt to get AES-related data
    const appStoreSecurity = useAppStoreSecurity()
    const rsaPrivateKey = await importRsaPrivateKey(appStoreSecurity.getClientPrivKey)
    const keyBlobBuf = await rsaOaepDecrypt(rsaPrivateKey, encKey.buffer)
    const keyBlob = new Uint8Array(keyBlobBuf)

    // 3. Split AES key, IV, and tag
    const aesKeyBytes = keyBlob.slice(0, 32) // 256-bit AES key
    const iv = keyBlob.slice(32, 44) // 12-byte IV
    const tag = keyBlob.slice(44, 60) // 16-byte tag

    // 4. Import AES key and decrypt
    const aesKey = await importAesKeyRaw(aesKeyBytes.buffer)

    const plainText = await aesGcmDecrypt(aesKey, { iv, ct, tag })

    return plainText!
  }
  catch (error) {
    console.error(`Failed to decrypt response value`, error)
    return encryptedBase64
  }
}
