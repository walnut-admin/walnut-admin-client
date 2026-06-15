import { aesGcmDecrypt, aesGcmEncrypt } from '@/utils/crypto/symmetric/aes-gcm'
import { watob, wbtoa } from '@/utils/window/base64'
import { getStorageIdbKey } from '../idb'
import { asyncLocalStorage, syncLocalStorage } from '../storage/localStorage'
import { withAsyncConditionalEncryption } from './async'
import { withSyncConditionalEncryption } from './sync'

/**
 * @description aes gcm encrypt/decrypt for localStorage
 */
export function enhancedAesGcmLocalStorage(forceEncrypt = false) {
  return withAsyncConditionalEncryption(asyncLocalStorage, {
    encrypt: async raw => aesGcmEncrypt(await getStorageIdbKey(), raw),
    decrypt: async encrypted => aesGcmDecrypt(await getStorageIdbKey(), encrypted),
  }, () => forceEncrypt)
}

/**
 * @description base64 atob/btoa encode/decode for localStorage
 */
export function enhancedBase64LocalStorage(forceEncrypt = false) {
  return withSyncConditionalEncryption(syncLocalStorage, {
    encrypt: plain => wbtoa(plain),
    decrypt: encoded => watob(encoded),
  }, () => forceEncrypt)
}
