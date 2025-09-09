import { arrayBufferToBase64 } from './transformer'

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
 * @param pem         - PEM string (-----BEGIN …-----)
 * @param type        - 'public' | 'private'  (which PEM block to expect)
 * @param algorithm   - Algorithm identifier / parameters for WebCrypto.importKey
 * @param extractable - Whether the resulting CryptoKey is extractable
 * @param keyUsages   - Array of usages for this key
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
  if (privateKey.algorithm.name !== 'RSA-OAEP') {
    throw new TypeError('Key must be RSA-OAEP')
  }

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
 * Core logic for RSA-OAEP key generation
 * @returns RSA-OAEP key pair (CryptoKeyPair)
 */
export async function generateRsaOaepKeyPairCore(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      hash: 'SHA-256',
    },
    true, // extractable
    ['encrypt', 'decrypt'],
  )
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
    ['decrypt', 'encrypt'],
  )
}

/**
 * Core logic for AES-GCM encryption
 * @param key AES-GCM secret key
 * @param plaintext Plaintext data (ArrayBuffer)
 * @param iv 12-byte random initialization vector
 * @returns Encrypted ciphertext + tag (ArrayBuffer)
 */
export async function aesGcmEncryptCore(
  key: CryptoKey,
  plaintext: Uint8Array<ArrayBuffer>,
  iv: Uint8Array<ArrayBuffer>,
): Promise<ArrayBuffer> {
  if (key.algorithm.name !== 'AES-GCM') {
    throw new TypeError('Key must be AES-GCM')
  }
  return crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext,
  )
}

/**
 * Core logic for AES-GCM decryption
 * @param key AES-GCM secret key
 * @param cipherWithTag Ciphertext + tag (ArrayBuffer)
 * @param iv 12-byte vector used during encryption
 * @returns Decrypted plaintext (ArrayBuffer)
 */
export async function aesGcmDecryptCore(
  key: CryptoKey,
  cipherWithTag: ArrayBuffer,
  iv: Uint8Array<ArrayBuffer>,
): Promise<ArrayBuffer> {
  if (key.algorithm.name !== 'AES-GCM') {
    throw new TypeError('Key must be AES-GCM')
  }
  return crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipherWithTag,
  )
}
