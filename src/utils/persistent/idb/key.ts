import { openDB } from 'idb'

const DB_NAME = 'vault'
const STORE = 'keyStore'
const KEY_ID = 'aes-gcm-master'

/* ---------- 私有：拿到永不变化的主密钥 ---------- */
export async function getStorageIdbKey(): Promise<CryptoKey> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE)
    },
  })

  let key = await db.get(STORE, KEY_ID)
  if (!key) {
    // 第一次：生成 256 位 AES-GCM 不可导出密钥
    key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false, // 不可导出（提取不了 raw key）
      ['encrypt', 'decrypt'],
    )
    await db.put(STORE, key, KEY_ID)
  }
  return key as CryptoKey
}
