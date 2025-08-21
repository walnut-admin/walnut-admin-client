import type { Nullable } from 'easy-fns-ts'

const { persist } = useAppEnvSeconds()

interface CookieOptions {
  prefixKey?: string
}

class Cookie {
  private prefixKey: string
  constructor({ prefixKey = '' }: CookieOptions = {}) {
    this.prefixKey = prefixKey.toUpperCase()
  }

  private key(name: string) {
    return this.prefixKey ? `${this.prefixKey}__${name}` : name
  }

  set(name: string, value: any, maxAge = persist, path = '/') {
    const str = typeof value === 'string' ? value : JSON.stringify(value)
    document.cookie = `${this.key(name)}=${encodeURIComponent(str)}; Max-Age=${maxAge}; Path=${path}`
  }

  get<T = any>(name: string, defaultValue: Nullable<T> = null): Nullable<T> {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${this.key(name)}=([^;]*)`))
    if (!m)
      return defaultValue
    try {
      const decoded = decodeURIComponent(m[1])
      return JSON.parse(decoded) as T
    }
    catch {
      return decodeURIComponent(m[1]) as unknown as T
    }
  }

  remove(name: string, path = '/') {
    document.cookie = `${this.key(name)}=; Max-Age=0; Path=${path}`
  }
}

const AppCookie = new Cookie({})

/* cookie */
export function setCookie(key: string, value: any, expire?: number) {
  AppCookie.set(key, value, expire)
}

export function getCookie(key: string): Nullable<any> {
  return AppCookie.get(key)
}

export function removeCookie(key: string) {
  AppCookie.remove(key)
}
