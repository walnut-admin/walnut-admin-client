import { version } from '~build/package'
import { getStorageKey } from '../shared'
import { asyncLocalStorage } from './localStorage'

export async function useAppStorageAsync<T>(
  key: string,
  initialValue: T,
  options: IStorageOptions<IStorageAsync> = {},
) {
  // Destructure options with defaults
  const {
    expire = Infinity,
    storage = asyncLocalStorage,
    usePresetKey = true,
    ttlMode = 'fixed',
  } = options

  // Generate actual storage key with preset if enabled
  const realKey = usePresetKey ? getStorageKey(key) : key

  // Reactive state to hold storage value
  const state = ref<T | null>(null)
  let suppressNextWrite = false // Prevent recursive writes

  // Initialize expiration timer utilities
  const { arm: armExpireTimer, clear: clearExpireTimer } = useExpireTimer({
    onExpire: async () => {
      // Clear storage and update state when expired
      await storage.removeItem(realKey)
      suppressNextWrite = true
      state.value = null
      suppressNextWrite = false
    },
  })

  /**
   * Calculate expiration timestamp based on configuration
   * @returns Promise with expiration timestamp or null if never expires
   */
  async function computeExpire(): Promise<number | null> {
    if (expire === Infinity)
      return null

    if (ttlMode === 'sliding') {
      // Sliding expiration: update on each write
      return Date.now() + expire
    }

    // Fixed expiration: reuse existing if available
    const raw = await storage.getItem(realKey)
    if (raw) {
      try {
        const { e } = JSON.parse(raw) as IStorageData<T>
        if (typeof e === 'number')
          return e
      }
      catch { /* Ignore parsing errors */ }
    }
    return Date.now() + expire
  }

  /**
   * Write data to storage
   * @param val Value to store
   * @returns Promise with expiration timestamp
   */
  async function write(val: T): Promise<number | null> {
    const exp = await computeExpire()
    const payload: IStorageData<T> = { v: val, e: exp, _v: version }
    await storage.setItem(realKey, JSON.stringify(payload))
    return exp
  }

  /**
   * Read data from storage with status handling
   * @returns Promise with read result
   */
  type ReadResult =
    | { status: 'ok', value: T, e: number | null }
    | { status: 'missing' }
    | { status: 'expired' }
    | { status: 'corrupt' }

  async function read(): Promise<ReadResult> {
    const raw = await storage.getItem(realKey)
    if (raw === null)
      return { status: 'missing' }

    try {
      const { v, e } = JSON.parse(raw) as IStorageData<T>
      if (e && Date.now() > e) {
        await storage.removeItem(realKey)
        return { status: 'expired' }
      }
      return { status: 'ok', value: v as T, e: e ?? null }
    }
    catch {
      await storage.removeItem(realKey)
      return { status: 'corrupt' }
    }
  }

  // Initial data loading
  const res = await read()
  switch (res.status) {
    case 'ok':
      state.value = res.value
      armExpireTimer(res.e)
      break
    case 'missing': {
      state.value = initialValue
      const expireAt = await write(initialValue)
      armExpireTimer(expireAt)
      break
    }
    default: // expired / corrupt
      state.value = null
      clearExpireTimer()
  }

  // Watch for state changes and sync to storage
  const watchStop = watch(
    state,
    async (val) => {
      if (suppressNextWrite)
        return

      if (val === null) {
        await storage.removeItem(realKey)
        clearExpireTimer()
      }
      else {
        const expireAt = await write(val)
        armExpireTimer(expireAt)
      }
    },
    { deep: true },
  )

  // Cleanup on unmount
  tryOnUnmounted(() => {
    watchStop()
    clearExpireTimer()
  })

  return state
}
