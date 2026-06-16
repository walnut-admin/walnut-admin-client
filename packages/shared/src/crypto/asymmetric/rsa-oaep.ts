/**
 * RSA-OAEP Utility Class (Browser-side)
 * Supports generating key pairs and decrypting with private key
 * Algorithm: RSA-OAEP + SHA-256
 */

import type { RsaKeyPairPEM } from '../const'
import { exportKeyToPEM, generateRsaOaepKeyPairCore } from '../shared'

/**
 * Generates RSA-OAEP key pair
 * @description Generates an RSA-OAEP key pair with SHA-256 hashing algorithm
 * @returns Promise resolving to an object containing public and private keys in PEM format, or null on failure
 */
export async function generateRsaOaepKeyPair(): Promise<RsaKeyPairPEM | null> {
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
