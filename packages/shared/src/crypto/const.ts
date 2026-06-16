/**
 * Cryptography Constants and Type Definitions
 * Centralized configuration for crypto operations
 */

// ========== AES-GCM Constants ==========
export const AES_GCM = {
  /** Algorithm name */
  NAME: 'AES-GCM' as const,
  /** Key length in bits (256-bit AES) */
  KEY_LENGTH: 256,
  /** Initialization Vector length in bytes (96-bit IV recommended for GCM) */
  IV_LENGTH: 12,
  /** Authentication tag length in bytes (128-bit tag for GCM) */
  TAG_LENGTH: 16,
  /** Minimum encrypted payload length (IV + TAG, no ciphertext) */
  MIN_PAYLOAD_LENGTH: 28, // 12 + 16
} as const

// ========== RSA-OAEP Constants ==========
export const RSA_OAEP = {
  /** Algorithm name */
  NAME: 'RSA-OAEP' as const,
  /** Modulus length in bits */
  MODULUS_LENGTH: 2048,
  /** Public exponent (65537) */
  PUBLIC_EXPONENT: new Uint8Array([0x01, 0x00, 0x01]),
  /** Hash algorithm */
  HASH: 'SHA-256' as const,
} as const

// ========== PEM Constants ==========
export const PEM = {
  /** PEM line length for formatting */
  LINE_LENGTH: 64,
  PUBLIC_KEY: {
    HEADER: 'PUBLIC KEY' as const,
    PREFIX: '-----BEGIN PUBLIC KEY-----' as const,
    SUFFIX: '-----END PUBLIC KEY-----' as const,
  },
  PRIVATE_KEY: {
    HEADER: 'PRIVATE KEY' as const,
    PREFIX: '-----BEGIN PRIVATE KEY-----' as const,
    SUFFIX: '-----END PRIVATE KEY-----' as const,
  },
} as const

// ========== Type Definitions ==========

/**
 * PEM key type
 */
export type PEMKeyType = 'public' | 'private'

/**
 * Result type for operations that may fail
 */
export type CryptoResult<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

/**
 * AES-GCM encryption result (raw format)
 */
export interface AesGcmRawResult {
  iv: Uint8Array<ArrayBuffer>
  ciphertext: Uint8Array<ArrayBuffer>
  tag: Uint8Array<ArrayBuffer>
}

/**
 * AES-GCM decryption input (raw format)
 */
export interface AesGcmRawInput {
  iv: Uint8Array<ArrayBuffer>
  ct: Uint8Array<ArrayBuffer>
  tag: Uint8Array<ArrayBuffer>
}

/**
 * RSA key pair in PEM format
 */
export interface RsaKeyPairPEM {
  publicKey: string
  privateKey: string
}
