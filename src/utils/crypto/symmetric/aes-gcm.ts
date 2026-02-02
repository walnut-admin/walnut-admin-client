import type { AesGcmRawInput, AesGcmRawResult } from '../const'
import { AES_GCM } from '../const'
import { aesGcmDecryptCore, aesGcmEncryptCore } from '../shared'
import { base64ToUint8Array, uint8ArrayToBase64, uint8ArrayToUtf8, utf8ToUint8Array } from '../transformer'

/**
 * Unified AES-256-GCM Encryption Interface
 * ------------------------------------------------------------------
 * Returns a Base64 string by default (concatenation of iv|ciphertext|tag).
 * If raw = true is specified, returns the split { iv, ciphertext, tag }
 * for convenient Envelope encryption.
 * ------------------------------------------------------------------
 * @param key        CryptoKey (must use AES-GCM algorithm with 256-bit length)
 * @param plaintext  String to be encrypted
 * @param raw        Whether to return split object, default is false
 * @returns Defaults to string; returns { iv, ciphertext, tag } when raw=true
 */
export async function aesGcmEncrypt(
  key: CryptoKey,
  plaintext: string,
  raw?: false
): Promise<string>
export async function aesGcmEncrypt(
  key: CryptoKey,
  plaintext: string,
  raw: true
): Promise<AesGcmRawResult>
export async function aesGcmEncrypt(
  key: CryptoKey,
  plaintext: string,
  raw = false,
) {
  /* ---------- Pre-check ---------- */
  if (key.algorithm.name !== AES_GCM.NAME) {
    throw new TypeError('Key must be AES-GCM')
  }

  /* ---------- Encryption ---------- */
  const iv = crypto.getRandomValues(new Uint8Array(AES_GCM.IV_LENGTH))
  const cipherBuffer = await aesGcmEncryptCore(
    key,
    utf8ToUint8Array(plaintext),
    iv,
  )

  const cipherBytes = new Uint8Array(cipherBuffer)
  const ciphertext = cipherBytes.slice(0, cipherBytes.length - AES_GCM.TAG_LENGTH)
  const tag = cipherBytes.slice(-AES_GCM.TAG_LENGTH)

  /* ---------- Return Format ---------- */
  if (raw) {
    return { iv, ciphertext, tag }
  }

  // Concatenate iv|ciphertext|tag at once before converting to Base64
  // to reduce frontend decoding times
  const payload = new Uint8Array(AES_GCM.IV_LENGTH + cipherBytes.length)
  payload.set(iv, 0)
  payload.set(cipherBytes, AES_GCM.IV_LENGTH)
  return uint8ArrayToBase64(payload)
}

/**
 * Unified AES-256-GCM Decryption Interface
 * ------------------------------------------------------------------
 * 1. Pass a Base64 string (concatenation of iv|ciphertext|tag) -> Returns decrypted string
 * 2. Pass a split object { iv, ciphertext, tag } -> Returns decrypted string
 * Returns null uniformly on decryption failure, no exceptions thrown.
 * ------------------------------------------------------------------
 */
export async function aesGcmDecrypt(
  key: CryptoKey,
  encoded: string
): Promise<string | null>
export async function aesGcmDecrypt(
  key: CryptoKey,
  parts: AesGcmRawInput
): Promise<string | null>
export async function aesGcmDecrypt(
  key: CryptoKey,
  input: string | AesGcmRawInput,
): Promise<string | null> {
  /* ---------- Pre-check ---------- */
  if (key.algorithm.name !== AES_GCM.NAME) {
    console.warn('Key must be AES-GCM')
    return null
  }

  try {
    let iv: Uint8Array<ArrayBuffer>
    let cipherWithTag: Uint8Array<ArrayBuffer>

    /* ---------- Branch 1: Base64 string ---------- */
    if (typeof input === 'string') {
      const data = base64ToUint8Array(input)
      // Fixed: More precise minimum length check
      // Need at least: IV (12) + TAG (16) + at least 1 byte ciphertext = 29
      // But we can be lenient and allow empty ciphertext for edge cases
      if (data.length < AES_GCM.MIN_PAYLOAD_LENGTH) {
        console.warn(`Invalid payload length: ${data.length}, expected at least ${AES_GCM.MIN_PAYLOAD_LENGTH}`)
        return null
      }
      iv = data.slice(0, AES_GCM.IV_LENGTH)
      cipherWithTag = data.slice(AES_GCM.IV_LENGTH)
    }
    /* ---------- Branch 2: Split object ---------- */
    else {
      const { iv: iv_, ct, tag } = input
      iv = iv_
      cipherWithTag = new Uint8Array(ct.length + tag.length)
      cipherWithTag.set(ct)
      cipherWithTag.set(tag, ct.length)
    }

    const plainBuffer = await aesGcmDecryptCore(
      key,
      cipherWithTag.buffer,
      iv,
    )
    return uint8ArrayToUtf8(new Uint8Array(plainBuffer))
  }
  catch (e) {
    console.warn('AES-GCM decryption failed', e)
    return null
  }
}
