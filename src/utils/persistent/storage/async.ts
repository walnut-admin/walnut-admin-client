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
  let isInitializing = true // ✅ 添加初始化标志
  let cachedExpireTime: number | null = null // ✅ 缓存过期时间

  const { arm: armExpireTimer, clear: clearExpireTimer } = useExpireTimer({
    onExpire: async () => {
      resetToInitial()
    },
  })

  async function resetToInitial() {
    await storage.removeItem(realKey)
    clearExpireTimer()
    cachedExpireTime = null // ✅ 清除缓存

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

    // ✅ 使用缓存避免重复读取
    if (cachedExpireTime !== null)
      return cachedExpireTime

    const oldRaw = await storage.getItem(realKey)
    if (oldRaw) {
      try {
        const { e } = superjson.parse(oldRaw) as IStorageData<T>
        if (typeof e === 'number')
          return e
      }
      catch (error) {
        // ✅ 记录错误
        console.warn(`Failed to parse storage data for key "${realKey}":`, error)
      }
    }
    return Date.now() + expire
  }

  async function read(): Promise<T | null> {
    const raw = await storage.getItem(realKey)
    if (raw === null)
      return null

    try {
      const { v, e } = superjson.parse(raw) as IStorageData<T>

      // ✅ 保存过期时间到缓存
      cachedExpireTime = e ?? null

      // ✅ 使用 > 而不是 >= 更符合直觉
      if (e && Date.now() > e) {
        resetToInitial()
        return null
      }

      return v as T
    }
    catch (error) {
      // ✅ 记录错误
      console.warn(`Failed to read storage data for key "${realKey}":`, error)
      storage.removeItem(realKey)
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
    try {
      await storage.setItem(realKey, superjson.stringify(payload))
      exp ? armExpireTimer(exp) : clearExpireTimer()
    }
    catch (error) {
      // ✅ 处理存储失败（如 QuotaExceededError）
      console.error(`Failed to write storage data for key "${realKey}":`, error)
    }
  }

  const res = await read()
  if (res !== null) {
    state.value = toShallowReactive(res)
  }
  else {
    state.value = toShallowReactive(cloneDeep(initialValue))
    await write(initialValue)
  }

  isInitializing = false // ✅ 初始化完成

  // ✅ 防抖写入，避免频繁 I/O
  const debouncedWrite = useDebounceFn(write, 100, { maxWait: 500 })

  watch(
    state,
    async (val) => {
      if (isInitializing)
        return // ✅ 跳过初始化触发

      if (val === null || val === undefined) {
        await storage.removeItem(realKey)
        clearExpireTimer()
        cachedExpireTime = null
      }
      else {
        await debouncedWrite(val) // ✅ 使用防抖
      }
    },
    { deep: true, flush: 'post' },
  )

  return state as Ref<T>
}
