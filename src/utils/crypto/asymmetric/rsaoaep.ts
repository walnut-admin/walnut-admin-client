/**
 * RSA-OAEP Utility Class (Browser-side)
 * Supports generating key pairs and decrypting with private key
 * Algorithm: RSA-OAEP + SHA-256
 */

import { base64ToArrayBuffer, exportKeyToPEM } from '../shared'

/**
 * Generates RSA-OAEP key pair
 * @description Generates an RSA-OAEP key pair with SHA-256 hashing algorithm
 * @returns Promise resolving to an object containing public and private keys in PEM format, or null on failure
 */
export async function generateRSAKeyPair() {
  if (!window.crypto?.subtle) {
    console.error('Web Crypto API is not supported in this environment')
    return null
  }

  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048, // Key length
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: 'SHA-256',
      },
      true, // Extractable
      ['encrypt', 'decrypt'],
    )

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
  if (!window.crypto?.subtle) {
    console.error('Web Crypto API is not supported in this environment')
    return null
  }

  if (!privateKeyPem || !base64Cipher) {
    console.warn('Private key or ciphertext is empty')
    return null
  }

  try {
    // Remove PEM headers/footers
    const pemContents = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s+/g, '')

    const binaryDer = base64ToArrayBuffer(pemContents)

    // Import private key
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['decrypt'],
    )

    // Decrypt
    const cipherBuffer = base64ToArrayBuffer(base64Cipher)
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      cipherBuffer,
    )

    return new TextDecoder().decode(decryptedBuffer)
  }
  catch (err) {
    console.error('Decryption failed:', err)
    return null
  }
}
