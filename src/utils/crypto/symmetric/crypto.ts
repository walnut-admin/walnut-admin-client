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
}

export class Encryption {
  private key
  private iv
  private method
  private mode
  private padding

  constructor(opt?: EncryptionOptions) {
    const { key, iv, method = 'AES', mode = 'CBC', padding = 'Pkcs7' } = opt!

    if (key.length % 4 !== 0)
      throw new Error('key length must be multiple of 4')

    this.key = CryptoJS.enc.Utf8.parse(key)
    this.iv = CryptoJS.enc.Utf8.parse(iv)

    this.method = CryptoJS[method]
    this.mode = mode
    this.padding = padding
  }

  encrypt(value: any) {
    if (!value)
      return

    const encrypted = this.method.encrypt(JSON.stringify(value), this.key, {
      iv: this.iv,
      mode: CryptoJS.mode[this.mode],
      padding: CryptoJS.pad[this.padding],
    })
    return encrypted.toString()
  }

  decrypt(encrypted: any) {
    if (!encrypted)
      return

    try {
      const decrypted = this.method.decrypt(encrypted, this.key, {
        iv: this.iv,
        mode: CryptoJS.mode[this.mode],
        padding: CryptoJS.pad[this.padding],
      })

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    }
    catch {
      return null
    }
  }
}
