import { watob, wbtoa } from '../window/base64'

/**
 * @description Wraps any Storage instance with transparent encryption/decryption.
 * The underlying storage keys remain unchanged; values are encrypted on write and decrypted on read.
 */
interface IWithEncryptionOptions {
  encrypt: (plain: string) => string
  decrypt: (encrypted: string) => string
}

function withEncryption(
  storage: Storage,
  { encrypt, decrypt }: IWithEncryptionOptions,
): Storage {
  return {
    get length() {
      return storage.length
    },

    clear() {
      storage.clear()
    },

    getItem(key: string): string | null {
      const encrypted = storage.getItem(key)
      return encrypted === null ? null : decrypt(encrypted)
    },

    setItem(key: string, value: string): void {
      storage.setItem(key, encrypt(value))
    },

    removeItem(key: string): void {
      storage.removeItem(key)
    },

    key(index: number): string | null {
      return storage.key(index)
    },
  }
}

/**
 * @description for seperate should encrypt env
 */
function withConditionalEncryption(
  storage: Storage,
  crypto: IWithEncryptionOptions,
  shouldEncrypt: () => boolean = () => !import.meta.env.DEV,
): Storage {
  return shouldEncrypt()
    ? withEncryption(storage, crypto)
    : storage
}

/**
 * @description base64 atob/btoa encode/decode for localStorage
 */
export const enhancedBase64LocalStorage = withConditionalEncryption(localStorage, {
  encrypt: plain => wbtoa(plain),
  decrypt: encoded => watob(encoded),
})
