// TODO rsa-oaep & aes-gcm
/**
 * Converts ArrayBuffer to Base64
 * @description Converts an ArrayBuffer object to a Base64 encoded string
 * @param buf - The ArrayBuffer to convert
 * @returns Base64 encoded string
 */
export const arrayBufferToBase64 = (buf: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buf)))

/**
 * Converts Base64 to ArrayBuffer
 * @description Converts a Base64 encoded string to an ArrayBuffer object
 * @param base64 - The Base64 string to convert
 * @returns ArrayBuffer containing the decoded data
 */
export const base64ToArrayBuffer = (b64: string): ArrayBuffer => Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer

/**
 * Exports key to PEM format
 * @description Exports a CryptoKey object to a PEM formatted string
 * @param key - The CryptoKey to export
 * @param type - Specifies whether the key is 'public' or 'private'
 * @returns Promise resolving to a PEM formatted string
 */
export async function exportKeyToPEM(key: CryptoKey, type: 'public' | 'private'): Promise<string> {
  const exported = await crypto.subtle.exportKey(
    type === 'public' ? 'spki' : 'pkcs8',
    key,
  )
  const base64Key = arrayBufferToBase64(exported)
  const pemHeader = type === 'public' ? 'PUBLIC KEY' : 'PRIVATE KEY'
  const pemBody = base64Key.match(/.{1,64}/g)?.join('\n') || ''
  return `-----BEGIN ${pemHeader}-----\n${pemBody}\n-----END ${pemHeader}-----`
}

/**
 * Imports a key from a PEM string
 * @description Mirror of `exportKeyToPEM`: reads a PEM-formatted public or
 *              private key and imports it into a CryptoKey object.
 * @param pem        - PEM string (-----BEGIN …-----)
 * @param type       - 'public' | 'private'  (which PEM block to expect)
 * @param algorithm  - Algorithm identifier / parameters for WebCrypto.importKey
 * @param extractable- Whether the resulting CryptoKey is extractable
 * @param keyUsages  - Array of usages for this key
 * @returns Promise resolving to the imported CryptoKey
 */
export async function importKeyFromPEM(
  pem: string,
  type: 'public' | 'private',
  algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams,
  extractable: boolean,
  keyUsages: KeyUsage[],
): Promise<CryptoKey> {
  const pemHeader = type === 'public' ? 'PUBLIC KEY' : 'PRIVATE KEY'
  const pemPrefix = `-----BEGIN ${pemHeader}-----`
  const pemSuffix = `-----END ${pemHeader}-----`

  if (!pem.includes(pemPrefix) || !pem.includes(pemSuffix)) {
    throw new Error(`Invalid PEM: expected ${pemHeader} envelope`)
  }

  const base64 = pem
    .replace(`${pemPrefix}\n`, '')
    .replace(`\n${pemSuffix}`, '')
    .replace(/\s+/g, '')

  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0))

  const format = type === 'public' ? 'spki' : 'pkcs8'

  return crypto.subtle.importKey(
    format,
    binary,
    algorithm,
    extractable,
    keyUsages,
  )
}

/**
 * 导入RSA私钥(PKCS#8 PEM格式)
 */
export async function importRsaPrivateKey(pem: string): Promise<CryptoKey> {
  return importKeyFromPEM(
    pem,
    'private',
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt'],
  )
}

/**
 * 导入RSA公钥(SPKI PEM格式)
 */
export async function importRsaPublicKey(pem: string): Promise<CryptoKey> {
  return importKeyFromPEM(
    pem,
    'public',
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt'],
  )
}

/**
 * RSA-OAEP加密
 * @param publicKey RSA公钥
 * @param data 待加密数据(ArrayBuffer)
 * @returns 加密后的数据(ArrayBuffer)
 */
export async function rsaOaepEncrypt(publicKey: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    data,
  )
}

/**
 * RSA-OAEP解密
 * @param privateKey RSA私钥
 * @param encryptedData 加密数据(ArrayBuffer)
 * @returns 解密后的数据(ArrayBuffer)
 */
export async function rsaOaepDecrypt(privateKey: CryptoKey, encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedData,
  )
}

/**
 * 生成AES-256-GCM密钥
 */
export async function generateAes256Key(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
}

/**
 * AES-GCM加密(返回拆分的IV、密文、标签)
 * @param key AES密钥
 * @param plaintext 明文
 * @returns { iv, ciphertext, tag }
 */
export async function aesGcmEncryptSplit(key: CryptoKey, plaintext: string): Promise<{
  iv: Uint8Array
  ciphertext: Uint8Array
  tag: Uint8Array
}> {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // GCM推荐12字节IV
  const encoder = new TextEncoder()
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext),
  )

  const cipherBytes = new Uint8Array(cipherBuffer)
  return {
    iv,
    ciphertext: cipherBytes.slice(0, cipherBytes.length - 16), // 剔除16字节标签
    tag: cipherBytes.slice(-16), // 提取16字节标签
  }
}

/**
 * AES-GCM解密(接收拆分的IV、密文、标签)
 * @param key AES密钥
 * @param iv 初始向量
 * @param ciphertext 密文
 * @param tag 认证标签
 * @returns 解密后的明文
 */
export async function aesGcmDecryptSplit(
  key: CryptoKey,
  iv: Uint8Array,
  ciphertext: Uint8Array,
  tag: Uint8Array,
): Promise<string> {
  // 合并密文和标签(GCM解密需要完整的 ciphertext + tag)
  const ctWithTag = new Uint8Array(ciphertext.length + tag.length)
  ctWithTag.set(ciphertext)
  ctWithTag.set(tag, ciphertext.length)

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ctWithTag,
  )

  return new TextDecoder().decode(plainBuffer)
}

/**
 * 导出AES密钥为原始格式(ArrayBuffer)
 */
export async function exportAesKeyRaw(key: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.exportKey('raw', key)
}

/**
 * 导入原始格式AES密钥
 */
export async function importAesKeyRaw(rawKey: ArrayBuffer): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  )
}
