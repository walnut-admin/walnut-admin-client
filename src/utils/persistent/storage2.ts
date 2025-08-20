import { version } from '~build/package'
import { getStorageKey } from './shared'

// TODO REMOVE THIS AND USE useAppStorageSync/useAppStorageAsync
interface IUseAppStorageOptions {
  /* expire time（milliseconds），Infinity means never expire, default Infinity */
  expire?: number
  /* any object that implements the Storage interface, default localStorage */
  storage?: Storage
  /* whether to use preset key, default true */
  usePresetKey?: boolean
}

interface IUseAppStorageData<T> {
  v: T // real value
  _v: string // app version
  e: number | null // expire time (milliseconds)，null means won't expire
}

export function useAppStorage2<T>(
  key: string,
  initialValue: T,
  options: IUseAppStorageOptions = {},
): Ref<T | null> {
  const {
    expire = Infinity,
    storage = localStorage,
    usePresetKey = true,
  } = options

  const realKey = usePresetKey ? getStorageKey(key) : key

  // read from storage and check expiration
  function read() {
    const raw = storage.getItem(realKey)
    if (raw === null)
      return null

    try {
      const { v, e } = JSON.parse(raw) as IUseAppStorageData<T>
      // expired
      if (e && Date.now() > e) {
        storage.removeItem(realKey)
        return null
      }
      return v as T
    }
    catch {
      // corrupted
      storage.removeItem(realKey)
      return null
    }
  }

  // write to storage
  function write(val: T) {
    const payload: IUseAppStorageData<T> = { v: val, e: expire === Infinity ? null : Date.now() + expire, _v: version }
    storage.setItem(realKey, JSON.stringify(payload))
  }

  return customRef<T | null>((track, trigger) => {
    let cached = read()

    // first time: storage is empty
    if (cached === null) {
      write(initialValue)
      cached = initialValue
    }

    return {
      get() {
        track()
        // re-check every read
        const fresh = read()
        if (fresh === null && cached !== null) {
          cached = null
          trigger()
        }
        return cached
      },
      set(val) {
        cached = val
        write(val!)
        trigger()
      },
    }
  })
}
