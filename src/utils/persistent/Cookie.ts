import type { Nullable } from 'easy-fns-ts'
import { isProd } from '@/utils/constant/vue'
import { AppPersistEncryption } from '@/utils/crypto'
import { isString } from 'easy-fns-ts'

const { persist } = useAppEnvSeconds()

interface CookieOptions {
  prefixKey?: string
  encrypt: boolean
}

class Cookie {
  private prefixKey
  private encrypt

  constructor({ prefixKey, encrypt }: CookieOptions) {
    this.prefixKey = prefixKey
    this.encrypt = encrypt
  }

  private getKey(key: string) {
    return this.prefixKey ? `${this.prefixKey}__${key}`.toLocaleUpperCase() : key
  }

  // default 7 days
  set(key: string, value: any, expire = +persist!, path = '/') {
    value = isString(value) ? value : JSON.stringify(value)
    const finalValue = this.encrypt
      ? AppPersistEncryption.encrypt(value)
      : value
    const exp = new Date()
    exp.setTime(exp.getTime() + expire * 1000)
    document.cookie = `${this.getKey(key)}=${escape(
      finalValue,
    )};path=${path};expires=${exp.toUTCString()}`
  }

  get(key: string, defaultValue = null) {
    const arr = document.cookie.split('; ')
    for (let i = 0; i < arr.length; i++) {
      const arr2 = arr[i].split('=')

      if (arr2[0] === this.getKey(key)) {
        let result = null
        const val = arr2[1]

        if (this.encrypt && val) {
          result = AppPersistEncryption.decrypt(unescape(val))
          try {
            return JSON.parse(result)
          }
          catch {
            return val
          }
        }
        return isString(val) ? val : JSON.parse(unescape(val))
      }
    }
    return defaultValue
  }

  remove(key: string) {
    this.set(key, 1, -1)
  }

  clear() {
    const keys = document.cookie.match(/[^ =;]+(?==)/g)

    if (keys) {
      for (let i = keys.length; i--;) {
        document.cookie = `${keys[i]}=0;expires=${new Date(
          0,
        ).toUTCString()};path=/;`
      }
    }
  }
}

const AppCookie = new Cookie({
  encrypt: isProd(),
})

/* cookie */
export function setCookie(key: string, value: any, expire?: number) {
  AppCookie.set(key, value, expire)
}

export function getCookie(key: string): Nullable<any> {
  return AppCookie.get(key)
}

export function clearCookie() {
  AppCookie.clear()
}

export function removeCookie(key: string) {
  AppCookie.remove(key)
}
