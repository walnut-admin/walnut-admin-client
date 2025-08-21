import { cloneDeep } from 'lodash-es'
import superjson from 'superjson'
import { version } from '~build/package'
import { getStorageKey } from '../shared'
import { syncLocalStorage } from './localStorage'

function toShallowReactive<T>(value: T): T {
  if (
    value instanceof Map
    || value instanceof Set
    || Array.isArray(value)
    || (value !== null && typeof value === 'object')
  ) {
    return shallowReactive(value) as T
  }
  return value
}

export function useAppStorageSync<T>(
  key: string,
  initialValue: T,
  options: IStorageOptions<IStorageSync> = {},
) {
  const {
    expire = Infinity,
    storage = syncLocalStorage,
    usePresetKey = true,
    ttlMode = 'fixed',
  } = options

  const realKey = usePresetKey ? getStorageKey(key) : key

  const state = ref<T>()

  const { arm: armExpireTimer, clear: clearExpireTimer } = useExpireTimer({
    onExpire: () => {
      resetToInitial()
    },
  })

  function resetToInitial() {
    storage.removeItem(realKey)
    const fresh = cloneDeep(initialValue)
    state.value = toShallowReactive(fresh)
    write(fresh)
  }

  function computeExpire(): number | null {
    if (expire === Infinity)
      return null
    if (ttlMode === 'sliding')
      return Date.now() + expire

    const oldRaw = storage.getItem(realKey)
    if (oldRaw) {
      try {
        const { e } = superjson.parse(oldRaw) as IStorageData<T>
        if (typeof e === 'number')
          return e
      }
      catch {}
    }
    return Date.now() + expire
  }

  function read(): T | null {
    const raw = storage.getItem(realKey)
    if (raw === null)
      return null
    try {
      const { v, e } = superjson.parse(raw) as IStorageData<T>
      e ? armExpireTimer(e) : clearExpireTimer()
      return v as T
    }
    catch {
      storage.removeItem(realKey)
      return null
    }
  }

  function write(val: T): void {
    const exp = computeExpire()
    const payload: IStorageData<T> = {
      v: val,
      e: expire === Infinity ? null : exp,
      _v: version,
    }
    storage.setItem(realKey, superjson.stringify(payload))
    exp ? armExpireTimer(exp) : clearExpireTimer()
  }

  const initialData = read()
  if (initialData !== null) {
    state.value = toShallowReactive(initialData)
  }
  else {
    state.value = toShallowReactive(cloneDeep(initialValue))
    write(initialValue)
  }

  watch(
    state,
    (val) => {
      if (val === null) {
        storage.removeItem(realKey)
        clearExpireTimer()
      }
      else {
        write(val!)
      }
    },
    { deep: true, flush: 'post' },
  )

  return state as Ref<T>
}
