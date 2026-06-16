import { aesGcmDecrypt, aesGcmEncrypt } from '@walnut/shared/crypto/symmetric/aes-gcm'
import { SingletonPromise } from '@walnut/shared/queue'
import { fromUrlSafeBase64, toUrlSafeBase64 } from '@walnut/shared/shared'
import { layoutConst } from '../routes/builtin'

const urlMaskingAesKeyQueue = new SingletonPromise<void>()

export function SingletonInitUrlMaskingAesKey() {
  const appStoreKey = useAppStoreKey()

  return urlMaskingAesKeyQueue.run(async () => {
    return await appStoreKey.initUrlMaskingAesKey()
  })
}

export async function encryptRouterUrl(value: string) {
  const appStoreKey = useAppStoreKey()

  await SingletonInitUrlMaskingAesKey()

  const cipher = await aesGcmEncrypt(appStoreKey.getUrlMaskingAesKey, value)

  return toUrlSafeBase64(cipher)
}

export async function decryptRouterUrl(value: string) {
  try {
    const appStoreKey = useAppStoreKey()

    await SingletonInitUrlMaskingAesKey()

    const cipherBytes = fromUrlSafeBase64(value)

    const plaintext = await aesGcmDecrypt(appStoreKey.getUrlMaskingAesKey, cipherBytes)

    if (!plaintext || plaintext.length === 0) {
      throw new Error('Invalid ciphertext')
    }

    return plaintext
  }
  catch (error) {
    console.warn('Url decryption failed, fallback to empty', error)
    await useAppRouterPush({ name: layoutConst.notFound.name })
    return null
  }
}
