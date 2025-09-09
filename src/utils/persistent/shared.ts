import { name } from '~build/package'

export const getStorageKey = (key: string) => `${name.toLocaleUpperCase().slice(0, 1)}__${import.meta.env.MODE.slice(0, 3).toLocaleUpperCase()}__${key.replaceAll('-', '_').toLocaleUpperCase()}`

/**
 * Remove all items in storage whose keys contain the specified substring
 * @param storage The storage to remove items from
 * @param substring The substring to match
 * @returns Array of removed key names
 */
export function removeStorageItemsContaining(storage: Storage, substring: string): string[] {
  // Store the removed key names
  const removedKeys: string[] = []

  // Create a copy of all keys to avoid issues caused by modifying the original collection during iteration
  const allKeys = Array.from({ length: storage.length }, (_, i) => storage.key(i))

  // Iterate over all keys
  allKeys.forEach((key) => {
    if (key && key.includes(substring)) {
      // Remove the matching key
      storage.removeItem(key)
      removedKeys.push(key)
    }
  })

  return removedKeys
}
