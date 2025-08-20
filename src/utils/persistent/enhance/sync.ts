/**
 * @description Wraps any Storage instance with transparent encryption/decryption.
 * The underlying storage keys remain unchanged; values are encrypted on write and decrypted on read.
 */
interface IWithEncryptionSyncOptions {
  encrypt: (plain: string) => string | null
  decrypt: (encrypted: string) => string | null
}

function withSyncEncryption(
  storage: IStorageSync,
  { encrypt, decrypt }: IWithEncryptionSyncOptions,
): IStorageSync {
  return {
    get length() {
      return storage.length
    },

    clear() {
      storage.clear()
    },

    getItem(key: string) {
      const string = storage.getItem(key)
      if (string === null)
        return null
      const decrypted = decrypt(string)
      return decrypted
    },

    setItem(key: string, value: string) {
      const encrypted = encrypt(value)
      storage.setItem(key, encrypted!)
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
export function withSyncConditionalEncryption(
  storage: IStorageSync,
  crypto: IWithEncryptionSyncOptions,
  shouldEncrypt: () => boolean = () => !import.meta.env.DEV,
): IStorageSync {
  return shouldEncrypt()
    ? withSyncEncryption(storage, crypto)
    : storage
}
