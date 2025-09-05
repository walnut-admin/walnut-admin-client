import { cloneDeep } from 'lodash-es'
import superjson from 'superjson'
import { version } from '~build/package'
import { getStorageKey } from '../shared'
import { asyncLocalStorage } from './localStorage'

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

export async function useAppStorageAsync<T>(
  key: string,
  initialValue: T,
  options: IStorageOptions<IStorageAsync> = {},
) {
  const {
    expire = Infinity,
    storage = asyncLocalStorage,
    usePresetKey = true,
    ttlMode = 'fixed',
    resetBehavior = 'clear',
  } = options

  const realKey = usePresetKey ? getStorageKey(key) : key
  const state = ref<T>()

  const { arm: armExpireTimer, clear: clearExpireTimer } = useExpireTimer({
    onExpire: async () => {
      resetToInitial()
    },
  })

  async function resetToInitial() {
    await storage.removeItem(realKey)
    clearExpireTimer()
    if (resetBehavior === 'keepInitial') {
      const fresh = cloneDeep(initialValue)
      state.value = toShallowReactive(fresh)
    }
    else {
      state.value = null as any
    }
  }

  async function computeExpire(): Promise<number | null> {
    if (expire === Infinity)
      return null
    if (ttlMode === 'sliding')
      return Date.now() + expire

    const oldRaw = await storage.getItem(realKey)
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

  async function read(): Promise<T | null> {
    const raw = await storage.getItem(realKey)
    if (raw === null)
      return null

    try {
      const { v, e } = superjson.parse(raw) as IStorageData<T>
      if (e && Date.now() >= e) {
        resetToInitial()
        return null
      }
      return v as T
    }
    catch {
      await storage.removeItem(realKey)
      return null
    }
  }

  async function write(val: T): Promise<void> {
    const exp = await computeExpire()
    const payload: IStorageData<T> = {
      v: val,
      e: expire === Infinity ? null : exp,
      _v: version,
    }
    await storage.setItem(realKey, superjson.stringify(payload))
    exp ? armExpireTimer(exp) : clearExpireTimer()
  }

  const res = await read()
  if (res !== null) {
    state.value = toShallowReactive(res)
  }
  else {
    state.value = toShallowReactive(cloneDeep(initialValue))
    write(initialValue)
  }

  watch(
    state,
    async (val) => {
      if (val === null) {
        await storage.removeItem(realKey)
        clearExpireTimer()
      }
      else {
        await write(val!)
      }
    },
    { deep: true, flush: 'post' },
  )

  return state as Ref<T>
}
