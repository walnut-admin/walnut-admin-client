import { name } from '~build/package'

export const getStorageKey = (key: string) => `${name.toLocaleUpperCase().slice(0, 1)}__${import.meta.env.MODE.slice(0, 3).toLocaleUpperCase()}__${key.replaceAll('-', '_').toLocaleUpperCase()}`

export const storageTtlMode = {
  /** 固定 TTL：从第一次写入开始计时 */
  Fixed: 'fixed',
  /** 滑动 TTL：每次写入都刷新过期时间 */
  Sliding: 'sliding',
} as const
