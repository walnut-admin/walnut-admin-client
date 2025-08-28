/**
 * Converts ArrayBuffer to Base64
 * @description Converts an ArrayBuffer object to a Base64 encoded string
 * @param buf - The ArrayBuffer to convert
 * @returns Base64 encoded string
 */
export function arrayBufferToBase64(buf: ArrayBuffer | ArrayBufferLike): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

/**
 * Converts Base64 to ArrayBuffer
 * @description Converts a Base64 encoded string to an ArrayBuffer object
 * @param base64 - The Base64 string to convert
 * @returns ArrayBuffer containing the decoded data
 */
export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer
}

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
 * Imports RSA private key (PKCS#8 PEM format)
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
 * Imports RSA public key (SPKI PEM format)
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
 * RSA-OAEP Encryption
 * @param publicKey - RSA public key
 * @param data - Data to encrypt (ArrayBuffer)
 * @returns Encrypted data (ArrayBuffer)
 */
export async function rsaOaepEncrypt(publicKey: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    data,
  )
}

/**
 * RSA-OAEP Decryption
 * @param privateKey - RSA private key
 * @param encryptedData - Encrypted data (ArrayBuffer)
 * @returns Decrypted data (ArrayBuffer)
 */
export async function rsaOaepDecrypt(privateKey: CryptoKey, encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedData,
  )
}

/**
 * Generates AES-256-GCM key
 */
export async function generateAes256Key(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
}

/**
 * AES-GCM Encryption (returns split IV, ciphertext, and tag)
 * @param key - AES key
 * @param plaintext - Plaintext string to encrypt
 * @returns { iv, ciphertext, tag } - Split encryption components
 */
export async function aesGcmEncryptSplit(key: CryptoKey, plaintext: string): Promise<{
  iv: Uint8Array
  ciphertext: Uint8Array
  tag: Uint8Array
}> {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 12-byte IV recommended for GCM
  const encoder = new TextEncoder()
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext),
  )

  const cipherBytes = new Uint8Array(cipherBuffer)
  return {
    iv,
    ciphertext: cipherBytes.slice(0, cipherBytes.length - 16), // Exclude 16-byte tag
    tag: cipherBytes.slice(-16), // Extract 16-byte tag
  }
}

/**
 * AES-GCM Decryption (accepts split IV, ciphertext, and tag)
 * @param key - AES key
 * @param iv - Initialization Vector
 * @param ciphertext - Encrypted ciphertext
 * @param tag - Authentication tag
 * @returns Decrypted plaintext string
 */
export async function aesGcmDecryptSplit(
  key: CryptoKey,
  iv: Uint8Array,
  ciphertext: Uint8Array,
  tag: Uint8Array,
): Promise<string> {
  // Combine ciphertext and tag (GCM decryption requires complete ciphertext + tag)
  const ctWithTag = new Uint8Array(ciphertext.length + tag.length)
  ctWithTag.set(ciphertext)
  ctWithTag.set(tag, ciphertext.length)

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ctWithTag,
  )

  return new TextDecoder().decode(plainBuffer)
}

/**
 * Exports AES key to raw format (ArrayBuffer)
 */
export async function exportAesKeyRaw(key: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.exportKey('raw', key)
}

/**
 * Imports AES key from raw format (ArrayBuffer)
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
