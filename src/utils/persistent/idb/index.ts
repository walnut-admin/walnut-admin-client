import type { IDBPDatabase } from 'idb'
import { generateAes256Key } from '@/utils/crypto/shared'
import { openDB } from 'idb'

const DB_NAME = 'vault'
const STORE = 'keyStore'
const KEY_ID = 'aes-gcm-master'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE)
        }
      },
    })
  }
  return dbPromise
}

export async function getStorageIdbKey(): Promise<CryptoKey> {
  const db = await getDb()
  let key = await db.get(STORE, KEY_ID)

  if (!key) {
    key = await generateAes256Key()
    await db.put(STORE, key, KEY_ID)
  }
  return key as CryptoKey
}
