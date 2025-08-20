import { version } from '~build/package'
import { getStorageKey } from '../shared'
import { syncLocalStorage } from './localStorage'

export function useAppStorageSync<T>(
  key: string,
  initialValue: T,
  options: IStorageOptions<IStorageSync> = {},
): ReturnType<typeof customRef<T | null>> {
  // Destructure options with defaults
  const {
    expire = Infinity,
    storage = syncLocalStorage,
    usePresetKey = true,
    ttlMode = 'fixed',
  } = options

  // Generate actual storage key with preset if enabled
  const realKey = usePresetKey ? getStorageKey(key) : key

  // Reactive state to hold storage value
  const state = ref<T | null>(null)

  // Initialize expiration timer utilities
  const { arm: armExpireTimer, clear: clearExpireTimer } = useExpireTimer({
    onExpire: () => {
      // Clear storage and update state when expired
      storage.removeItem(realKey)
      state.value = null
    },
  })

  /**
   * Calculate expiration timestamp based on configuration
   * @returns Expiration timestamp or null if never expires
   */
  function computeExpire(): number | null {
    if (expire === Infinity)
      return null

    if (ttlMode === 'sliding') {
      // Sliding expiration: update on each write
      return Date.now() + expire
    }

    // Fixed expiration: reuse existing if available
    const oldRaw = storage.getItem(realKey)
    if (oldRaw) {
      try {
        const { e } = JSON.parse(oldRaw) as IStorageData<T>
        if (typeof e === 'number')
          return e
      }
      catch { /* Ignore parsing errors */ }
    }
    return Date.now() + expire
  }

  /**
   * Read data from storage
   * @returns Parsed value or null if missing/corrupt/expired
   */
  function read(): T | null {
    const raw = storage.getItem(realKey)
    if (raw === null)
      return null

    try {
      const { v, e } = JSON.parse(raw) as IStorageData<T>

      // Set up expiration timer if needed
      e ? armExpireTimer(e) : clearExpireTimer()

      return v as T
    }
    catch {
      // Clear corrupt data
      storage.removeItem(realKey)
      return null
    }
  }

  /**
   * Write data to storage
   * @param val Value to store
   */
  function write(val: T): void {
    const exp = computeExpire()

    const payload: IStorageData<T> = {
      v: val,
      e: expire === Infinity ? null : exp,
      _v: version,
    }
    storage.setItem(realKey, JSON.stringify(payload))

    // Update timer for sliding expiration
    if (exp)
      armExpireTimer(exp)
    else
      clearExpireTimer()
  }

  // Initial data loading
  const initialData = read()
  if (initialData !== null) {
    state.value = initialData
  }
  else {
    // Write initial value for first use
    write(initialValue)
    state.value = initialValue
  }

  // Create custom ref for reactive storage
  return customRef<T | null>((track, trigger) => ({
    get() {
      track()
      return state.value
    },
    set(val) {
      if (val === null) {
        // Clear storage and timer when setting null
        storage.removeItem(realKey)
        clearExpireTimer()
      }
      else {
        write(val)
      }
      state.value = val
      trigger()
    },
  }))
}
