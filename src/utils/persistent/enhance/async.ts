/**
 * @description Wraps any Storage instance with transparent encryption/decryption.
 * The underlying storage keys remain unchanged; values are encrypted on write and decrypted on read.
 */
interface IWithEncryptionAsyncOptions {
  encrypt: (plain: string) => Promise<string | null>
  decrypt: (encrypted: string) => Promise<string | null>
}

function withAsyncEncryption(
  storage: IStorageAsync,
  { encrypt, decrypt }: IWithEncryptionAsyncOptions,
): IStorageAsync {
  return {
    get length() {
      return storage.length
    },

    clear() {
      storage.clear()
    },

    async getItem(key: string) {
      const string = await storage.getItem(key)
      if (string === null)
        return null
      const decrypted = await decrypt(string)
      return decrypted
    },

    async setItem(key: string, value: string) {
      const encrypted = await encrypt(value)
      await storage.setItem(key, encrypted!)
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
export function withAsyncConditionalEncryption(
  storage: IStorageAsync,
  crypto: IWithEncryptionAsyncOptions,
  shouldEncrypt: () => boolean = () => !import.meta.env.DEV,
): IStorageAsync {
  return shouldEncrypt()
    ? withAsyncEncryption(storage, crypto)
    : storage
}
