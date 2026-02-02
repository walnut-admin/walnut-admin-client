import { importAesKeyFromRaw, importRsaPrivateKey, rsaOaepDecrypt } from '@/utils/crypto/shared'
import { aesGcmDecrypt } from '@/utils/crypto/symmetric/aes-gcm'
import { base64ToUint8Array } from '@/utils/crypto/transformer'

export async function decryptResponseValue(encryptedBase64: string): Promise<string | null> {
  try {
    // 1. Parse encrypted payload
    const payloadStr = atob(encryptedBase64)
    const payload = JSON.parse(payloadStr)
    const ct = base64ToUint8Array(payload.cipher)
    const encKey = base64ToUint8Array(payload.key)

    // 2. Import RSA private key and decrypt to get AES-related data
    const appStoreSecurity = useAppStoreSecurity()
    const rsaPrivateKey = await importRsaPrivateKey(appStoreSecurity.getClientPrivKey)
    const keyBlobBuf = await rsaOaepDecrypt(rsaPrivateKey, encKey)
    const keyBlob = new Uint8Array(keyBlobBuf)

    // 3. Split AES key, IV, and tag
    const aesKeyBytes = keyBlob.slice(0, 32) // 256-bit AES key
    const iv = keyBlob.slice(32, 44) // 12-byte IV
    const tag = keyBlob.slice(44, 60) // 16-byte tag

    // 4. Import AES key and decrypt
    const aesKey = await importAesKeyFromRaw(aesKeyBytes.buffer)

    const plainText = await aesGcmDecrypt(aesKey, { iv, ct, tag })

    return plainText
  }
  catch (error) {
    console.error(`Failed to decrypt response value`, error)
    return null
  }
}
