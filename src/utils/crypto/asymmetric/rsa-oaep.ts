/**
 * RSA-OAEP Utility Class (Browser-side)
 * Supports generating key pairs and decrypting with private key
 * Algorithm: RSA-OAEP + SHA-256
 */

import { exportKeyToPEM, generateRsaOaepKeyPairCore, importRsaPrivateKey, rsaOaepDecrypt } from '../shared'
import { base64ToArrayBuffer, u8ToUtf8 } from '../transformer'

/**
 * Generates RSA-OAEP key pair
 * @description Generates an RSA-OAEP key pair with SHA-256 hashing algorithm
 * @returns Promise resolving to an object containing public and private keys in PEM format, or null on failure
 */
export async function generateRSAKeyPair() {
  try {
    const keyPair = await generateRsaOaepKeyPairCore()
    const publicKeyPem = await exportKeyToPEM(keyPair.publicKey, 'public')
    const privateKeyPem = await exportKeyToPEM(keyPair.privateKey, 'private')

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
    }
  }
  catch (err) {
    console.error('Failed to generate key pair:', err)
    return null
  }
}

/**
 * Decrypts with private key (takes Base64 encrypted data)
 * @description Decrypts Base64 encoded ciphertext using an RSA-OAEP private key in PEM format
 * @param privateKeyPem - Private key in PEM format
 * @param base64Cipher - Encrypted data in Base64 format
 * @returns Promise resolving to decrypted string, or null on failure
 */
export async function decryptWithPrivateKey(
  privateKeyPem: string,
  base64Cipher: string,
): Promise<string | null> {
  if (!privateKeyPem || !base64Cipher) {
    console.warn('Private key or ciphertext is empty')
    return null
  }

  try {
    // Reuse private key import logic from shared.ts
    const privateKey = await importRsaPrivateKey(privateKeyPem)

    // Convert ciphertext format
    const cipherBuffer = base64ToArrayBuffer(base64Cipher)

    // Reuse RSA-OAEP decryption logic from shared.ts
    const decryptedBuffer = await rsaOaepDecrypt(privateKey, cipherBuffer)

    return u8ToUtf8(new Uint8Array(decryptedBuffer))
  }
  catch (err) {
    console.error('Decryption failed:', err)
    return null
  }
}
