import { hkdfSha256 } from '../kdf/hkdf-sha256'
import { base64ToArrayBuffer } from '../transformer'

/**
 * 派生 API 签名密钥
 *
 * 算法：sessionDerivedKey = HKDF-SHA256(sessionKeyHash, aesKey, info)
 *
 * 说明：
 * - sessionKeyHash: Session Key 的 SHA256 哈希值（服务端也存储这个 hash）
 * - aesKey: 握手时协商的 AES 密钥（作为 salt）
 * - info: 固定字符串 "walnut-admin-api-sign-v1"（用途标识）
 *
 * @param sessionKey 登录时返回的 Session Key（base64 编码）
 * @param aesKey 握手时协商的 AES Key
 * @param hkdfInfo 用途标识字符串
 * @returns 派生的签名密钥（ArrayBuffer）
 */
export async function deriveApiSignKey(
  sessionKey: string,
  aesKey: string,
  hkdfInfo: string,
): Promise<ArrayBuffer> {
  // 1. 将 base64 编码的 session key 解码为 ArrayBuffer
  const sessionKeyBytes = base64ToArrayBuffer(sessionKey)

  // 2. 计算 Session Key 的 SHA256 哈希（与服务端保持一致）
  const sessionKeyHash = await crypto.subtle.digest('SHA-256', sessionKeyBytes)

  // 3. 将 AES Key 字符串转换为 ArrayBuffer（作为 salt）
  const aesKeyBytes = new TextEncoder().encode(aesKey).buffer

  // 4. 将用途标识字符串转换为 ArrayBuffer
  const infoBytes = new TextEncoder().encode(hkdfInfo).buffer

  // 5. 使用 HKDF 派生签名密钥
  const derivedKey = await hkdfSha256(
    sessionKeyHash, // IKM
    aesKeyBytes, // salt
    infoBytes, // info
    32, // 输出 32 字节
  )

  return derivedKey
}
