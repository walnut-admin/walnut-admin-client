/**
 * Extract the first complete JSON object from the buffer using bracket balancing.
 * Handles both raw JSON and `data:`-prefixed SSE format.
 * Finds JSON at any position — supports text preceding the JSON.
 * Returns the JSON substring, or null if no complete JSON object found.
 */
import { JSON_BUFFER_MAX } from '../../config/constants'

export function extractJSON(buf: string): string | null {
  const trimmed = buf.trim()

  let content: string
  if (trimmed.startsWith('data:')) {
    content = trimmed.substring(5).trim()
  }
  else {
    content = trimmed
  }

  // Find first `{` — supports text before JSON (e.g. "好的，\n\n{...}")
  const braceIdx = content.indexOf('{')
  if (braceIdx === -1)
    return null
  content = content.substring(braceIdx)

  // Bracket-balance to find the first complete JSON object
  let depth = 0
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') {
      depth++
    }
    else if (content[i] === '}') {
      depth--
      if (depth === 0) {
        return content.slice(0, i + 1)
      }
    }
  }

  return null
}

/**
 * Check if buffer seems to be waiting for a complete JSON business response.
 * Only returns true when `{` is immediately followed by `"type"` key —
 * the signature of business JSON. Regular code with `{` is not blocked.
 */
export function isBufferWaitingForJSON(buf: string, maxBuffer = JSON_BUFFER_MAX): boolean {
  // 代码块（```）内的 { 是代码语法，不视为 JSON
  if (buf.includes('```'))
    return false

  const trimmedBuf = buf.trim()
  const braceIdx = trimmedBuf.indexOf('{')
  if (braceIdx === -1)
    return false
  const jsonPart = trimmedBuf.substring(braceIdx)
  if (jsonPart.length >= maxBuffer)
    return false
  // 业务 JSON 特征：{ 后紧跟 "type" 键
  // 正则要求 { 和 "type" 之间只有空白，避免误判代码中的 "type" 字段
  return /^\s*\{\s*"type"\s*:/.test(jsonPart)
}
