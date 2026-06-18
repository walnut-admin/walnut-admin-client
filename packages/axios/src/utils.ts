/**
 * Serialize params using the provided serializer (mirrors axios internal behavior)
 */
function serializeParams(
  params: any,
  paramsSerializer?: any,
): string {
  if (!params)
    return ''

  if (paramsSerializer) {
    if (typeof paramsSerializer === 'function')
      return paramsSerializer(params)

    if (typeof paramsSerializer.serialize === 'function')
      return paramsSerializer.serialize(params)
  }

  // Fallback: standard URLSearchParams serialization
  return new URLSearchParams(params).toString()
}

/**
 * @description build deterministic sorted url, used for `adapters` cache key
 */
export function buildSortedURL(
  url?: string,
  params?: any,
  paramsSerializer?: any,
): string {
  let builtURL = url || 'root-endpoint'

  const serialized = serializeParams(params, paramsSerializer)
  if (serialized) {
    builtURL += (builtURL.includes('?') ? '&' : '?') + serialized
  }

  const [urlPath, queryString] = builtURL.split('?')

  if (queryString) {
    const paramsPair = queryString.split('&')
    return `${urlPath}?${paramsPair.sort().join('&')}`
  }

  return builtURL
}

/**
 * @description generate nonce header value for axios
 */
export function generateNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('')
}
