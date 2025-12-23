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
    resetBehavior = 'clear',
  } = options

  const realKey = usePresetKey ? getStorageKey(key) : key
  const state = ref<T>()
  let isInitializing = true // ✅ 添加初始化标志
  let cachedExpireTime: number | null = null // ✅ 缓存过期时间

  const { arm: armExpireTimer, clear: clearExpireTimer } = useExpireTimer({
    onExpire: () => {
      resetToInitial()
    },
  })

  function resetToInitial() {
    storage.removeItem(realKey)
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

  function computeExpire(): number | null {
    if (expire === Infinity)
      return null
    if (ttlMode === 'sliding')
      return Date.now() + expire

    // ✅ 使用缓存避免重复读取
    if (cachedExpireTime !== null)
      return cachedExpireTime

    const oldRaw = storage.getItem(realKey)
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

  function read(): T | null {
    const raw = storage.getItem(realKey)
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

  function write(val: T): void {
    const exp = computeExpire()
    const payload: IStorageData<T> = {
      v: val,
      e: expire === Infinity ? null : exp,
      _v: version,
    }
    try {
      storage.setItem(realKey, superjson.stringify(payload))
      exp ? armExpireTimer(exp) : clearExpireTimer()
    }
    catch (error) {
      // ✅ 处理存储失败（如 QuotaExceededError）
      console.error(`Failed to write storage data for key "${realKey}":`, error)
    }
  }

  const initialData = read()
  if (initialData !== null) {
    state.value = toShallowReactive(initialData)
  }
  else {
    state.value = toShallowReactive(cloneDeep(initialValue))
    write(initialValue)
  }

  isInitializing = false // ✅ 标记初始化完成

  // ✅ 防抖写入，避免频繁 I/O
  const debouncedWrite = useDebounceFn(write, 100, { maxWait: 500 })

  watch(
    state,
    (val) => {
      if (isInitializing)
        return // ✅ 跳过初始化触发

      if (val === null || val === undefined) {
        storage.removeItem(realKey)
        clearExpireTimer()
        cachedExpireTime = null
      }
      else {
        debouncedWrite(val) // 防抖写入
      }
    },
    { deep: true, flush: 'post' },
  )

  return state as Ref<T>
}
