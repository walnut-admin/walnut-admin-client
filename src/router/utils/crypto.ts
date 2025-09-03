import { aesGcmDecrypt, aesGcmEncrypt } from '@/utils/crypto/symmetric/aes-gcm'
import { fromUrlSafeBase64, toUrlSafeBase64 } from '@/utils/shared'

export async function encryptUrlMasking(value: string) {
  const appStoreKey = useAppStoreKey()

  const cipher = await aesGcmEncrypt(appStoreKey.getUrlMaskingAesKey, value)

  return toUrlSafeBase64(cipher)
}

export async function decryptUrlMasking(value: string) {
  try {
    const appStoreKey = useAppStoreKey()

    const cipherBytes = fromUrlSafeBase64(value)

    const plaintext = await aesGcmDecrypt(appStoreKey.getUrlMaskingAesKey, cipherBytes)

    return plaintext!
  }
  catch (error) {
    console.warn('Url decryption failed, fallback to empty', error)
    return '[invalid]'
  }
}
