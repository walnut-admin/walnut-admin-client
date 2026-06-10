/**
 * Lightweight LRU Map with a capacity cap.
 * API is a subset of Map (get/set/has/clear) — drop-in replacement
 * for `new Map()` when you want automatic eviction of oldest entries.
 */
export class LRUMap<K, V> {
  #map = new Map<K, V>()
  #max: number

  constructor(max: number) {
    this.#max = max
  }

  get(key: K): V | undefined {
    return this.#map.get(key)
  }

  set(key: K, value: V): void {
    // Delete-then-set to bump the key to the insertion-order tail (most-recent)
    this.#map.delete(key)
    this.#map.set(key, value)
    if (this.#map.size > this.#max) {
      const oldest = this.#map.keys().next().value
      if (oldest !== undefined)
        this.#map.delete(oldest)
    }
  }

  has(key: K): boolean {
    return this.#map.has(key)
  }

  delete(key: K): boolean {
    return this.#map.delete(key)
  }

  clear(): void {
    this.#map.clear()
  }
}
