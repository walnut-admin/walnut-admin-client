import { fromUrlSafeBase64, toUrlSafeBase64 } from '@/utils/shared'
import CryptoJS from 'crypto-js'

// CryptoJS Ciphers
// · AES (the default)
// · DES
// · TripleDES
// · Rabbit
// · RC4

// CryptoJS supports the following modes:
// · CBC (the default)
// · CFB
// · CTR
// · OFB
// · ECB

// CryptoJS supports the following padding schemes:
// · Pkcs7 (the default)
// · Iso97971
// · AnsiX923
// · Iso10126
// · ZeroPadding
// · NoPadding

 type EncryptionMethod = 'AES' | 'DES' | 'TripleDES' | 'Rabbit' | 'RC4'
 type EncryptionMode = 'CBC' | 'CFB' | 'CTR' | 'OFB' | 'ECB'
 type EncryptionPadding =
   | 'Pkcs7'
   | 'Iso97971'
   | 'AnsiX923'
   | 'Iso10126'
   | 'ZeroPadding'
   | 'NoPadding'

interface EncryptionOptions {
  /**
   * @description has to be a string with length of multiple of 4
   * @link https://juejin.cn/post/6844904198677463053
   */
  key: string
  iv: string
  method?: EncryptionMethod
  mode?: EncryptionMode
  padding?: EncryptionPadding
  urlSafe?: boolean
}

export class Encryption {
  private key: CryptoJS.lib.WordArray
  private iv: CryptoJS.lib.WordArray
  private method
  private mode: keyof typeof CryptoJS.mode
  private padding: keyof typeof CryptoJS.pad
  private urlSafe: boolean

  constructor(opt?: EncryptionOptions) {
    const { key, iv, method = 'AES', mode = 'CBC', padding = 'Pkcs7', urlSafe = false } = opt!

    if (key.length % 4 !== 0)
      throw new Error('key length must be multiple of 4')

    this.key = CryptoJS.enc.Utf8.parse(key)
    this.iv = CryptoJS.enc.Utf8.parse(iv)

    this.method = CryptoJS[method]
    this.mode = mode
    this.padding = padding
    this.urlSafe = urlSafe
  }

  encrypt(value: any) {
    if (!value)
      return

    const encrypted = this.method.encrypt(JSON.stringify(value), this.key, {
      iv: this.iv,
      mode: CryptoJS.mode[this.mode],
      padding: CryptoJS.pad[this.padding],
    })

    const base64 = encrypted.toString()

    return this.urlSafe ? toUrlSafeBase64(base64) : base64
  }

  decrypt(cipher: string) {
    if (!cipher)
      return

    try {
      const base64 = this.urlSafe ? fromUrlSafeBase64(cipher) : cipher

      const decrypted = this.method.decrypt(base64, this.key, {
        iv: this.iv,
        mode: CryptoJS.mode[this.mode],
        padding: CryptoJS.pad[this.padding],
      })

      const text = decrypted.toString(CryptoJS.enc.Utf8)
      return JSON.parse(text)
    }
    catch {
      return null
    }
  }
}
