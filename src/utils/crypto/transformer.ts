import { Base64 } from 'js-base64'

/**
 * Converts an ArrayBuffer-like object to a Base64 encoded string.
 * @param buf - The ArrayBuffer-like object to convert.
 * @returns Base64 encoded string.
 */
export function arrayBufferToBase64(buf: ArrayBufferLike): string {
  return Base64.fromUint8Array(new Uint8Array(buf))
}

/**
 * Converts a Uint8Array to a Base64 encoded string.
 * @param u8 - The Uint8Array to convert.
 * @returns Base64 encoded string.
 */
export function uint8ArrayToBase64(u8: Uint8Array): string {
  return Base64.fromUint8Array(u8)
}

/**
 * Decodes a Base64 encoded string into a Uint8Array.
 * @param b64 - The Base64 encoded string.
 * @returns Decoded Uint8Array.
 */
export function base64ToUint8Array(b64: string): Uint8Array {
  return Base64.toUint8Array(b64)
}

/**
 * Decodes a Base64 encoded string into an ArrayBuffer.
 * @param b64 - The Base64 encoded string.
 * @returns Decoded ArrayBuffer.
 */
export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  return Base64.toUint8Array(b64).slice().buffer
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 * @param u8 - The Uint8Array to convert.
 * @returns Hexadecimal string representation.
 */
export function uint8ArrayToHex(u8: Uint8Array): string {
  return [...u8].map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Converts a hexadecimal string to a Uint8Array.
 * @param hex - The hexadecimal string to convert.
 * @throws {TypeError} If the hex string length is odd.
 * @returns Decoded Uint8Array.
 */
export function hexToUint8Array(hex: string): Uint8Array {
  const len = hex.length
  if (len % 2)
    throw new TypeError('Odd hex string')
  const out = new Uint8Array(len / 2)
  for (let i = 0; i < len; i += 2)
    out[i >> 1] = Number.parseInt(hex.slice(i, i + 2), 16)
  return out
}

/**
 * Encodes a UTF-8 string into a Uint8Array.
 * @param str - The string to encode.
 * @returns Encoded Uint8Array.
 */
export function utf8ToUint8Array(str: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(str)
}

/**
 * Decodes a Uint8Array into a UTF-8 string.
 * @param u8 - The Uint8Array to decode.
 * @returns Decoded UTF-8 string.
 */
export function uint8ArrayToUtf8(u8: Uint8Array): string {
  return new TextDecoder().decode(u8)
}

/**
 * ArrayBuffer to Hexadecimal string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
