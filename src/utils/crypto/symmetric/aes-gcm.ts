import { base64ToUint8Array, uint8ArrayToBase64 } from '../shared'

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
): Promise<{ iv: Uint8Array<ArrayBuffer>, ciphertext: Uint8Array<ArrayBuffer>, tag: Uint8Array<ArrayBuffer> }>
export async function aesGcmEncrypt(
  key: CryptoKey,
  plaintext: string,
  raw = false,
) {
  /* ---------- Pre-check ---------- */
  if (key.algorithm.name !== 'AES-GCM') {
    throw new TypeError('Key must be AES-GCM')
  }

  /* ---------- Encryption ---------- */
  const IV_LEN = 12 // 96-bit IV recommended for GCM
  const TAG_LEN = 16 // 128-bit tag fixed for GCM

  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN))
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  )

  const cipherBytes = new Uint8Array(cipherBuffer)
  const ciphertext = cipherBytes.slice(0, cipherBytes.length - TAG_LEN)
  const tag = cipherBytes.slice(-TAG_LEN)

  /* ---------- Return Format ---------- */
  if (raw) {
    return { iv, ciphertext, tag }
  }

  // Concatenate iv|ciphertext|tag at once before converting to Base64
  // to reduce frontend decoding times
  const payload = new Uint8Array(IV_LEN + cipherBytes.length)
  payload.set(iv, 0)
  payload.set(cipherBytes, IV_LEN)
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
  parts: { iv: Uint8Array<ArrayBuffer>, ct: Uint8Array<ArrayBuffer>, tag: Uint8Array<ArrayBuffer> }
): Promise<string | null>
export async function aesGcmDecrypt(
  key: CryptoKey,
  input: string | { iv: Uint8Array<ArrayBuffer>, ct: Uint8Array<ArrayBuffer>, tag: Uint8Array<ArrayBuffer> },
): Promise<string | null> {
  /* ---------- Pre-check ---------- */
  if (key.algorithm.name !== 'AES-GCM') {
    console.warn('Key must be AES-GCM')
    return null
  }

  try {
    let iv: Uint8Array
    let cipherWithTag: Uint8Array

    /* ---------- Branch 1: Base64 string ---------- */
    if (typeof input === 'string') {
      const data = base64ToUint8Array(input)
      if (data.length < 12 + 16)
        return null // Minimum length 28 (12 for IV + 16 for TAG)
      iv = data.slice(0, 12)
      cipherWithTag = data.slice(12)
    }
    /* ---------- Branch 2: Split object ---------- */
    else {
      const { iv: iv_, ct, tag } = input
      iv = iv_
      cipherWithTag = new Uint8Array(ct.length + tag.length)
      cipherWithTag.set(ct)
      cipherWithTag.set(tag, ct.length)
    }

    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      cipherWithTag as BufferSource,
    )
    return new TextDecoder().decode(plainBuffer)
  }
  catch (e) {
    console.warn('AES-GCM decryption failed', e)
    return null
  }
}
