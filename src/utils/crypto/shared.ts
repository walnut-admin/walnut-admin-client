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
