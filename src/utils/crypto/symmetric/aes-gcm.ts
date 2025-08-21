export async function aesGcmEncrypt(
  aesKey: CryptoKey,
  plain: string,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const buf = new TextEncoder().encode(plain)
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, buf)

  const payload = new Uint8Array(iv.byteLength + ct.byteLength)
  payload.set(iv, 0)
  payload.set(new Uint8Array(ct), iv.byteLength)
  return btoa(String.fromCharCode(...payload))
}

export async function aesGcmDecrypt(
  aesKey: CryptoKey,
  encoded: string,
): Promise<string | null> {
  try {
    const data = Uint8Array.from(atob(encoded), c => c.charCodeAt(0))
    const iv = data.slice(0, 12)
    const ct = data.slice(12)
    const buf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      ct,
    )
    return new TextDecoder().decode(buf)
  }
  catch {
    return null
  }
}
