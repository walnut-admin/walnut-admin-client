import type { Serializer } from '@vueuse/core'
import { isProd } from '@/utils/constant/vue'
import { AppPersistEncryption } from '@/utils/crypto'
import { name, version } from '~build/package'

interface IAppStorageOptions<T> {
  storage?: typeof localStorage | typeof sessionStorage

  /**
   * @description milliseconds
   */
  expire?: number
  encrypt?: boolean
  usePresetKey?: boolean
  serializer?: Serializer<T>
}

interface IAppStorageData<T> {
  v: T // real value
  _v: string // app version
  e: number | null // expire time (milliseconds)，null means won't expire
  enc: boolean // is encrypted
}

const getStorageKey = (key: string) => `${name.toLocaleUpperCase().slice(0, 1)}__${import.meta.env.MODE.slice(0, 3).toLocaleUpperCase()}__${key.replaceAll('-', '_').toLocaleUpperCase()}`

export function getStorageRealKey(k: string, presetKey: boolean) {
  return presetKey
    ? getStorageKey(k)
    : k
}

// app storage
// default cache 7 days
// defualt only encrypt in prod
// map/set need to pass `serializer`, and no more expire nor encrypt
export function useAppStorage<T>(originalKey: string, initialValue: MaybeRef<T>, options: IAppStorageOptions<T> = {}) {
  const { persist: persistSeconds } = useAppEnvSeconds()
  const { storage = localStorage, expire = persistSeconds, encrypt = isProd(), usePresetKey = true, serializer } = options

  const realKey = getStorageRealKey(originalKey, usePresetKey)

  return useStorage<T>(realKey, initialValue, storage, {
    serializer: serializer ?? {
      read: (val): T => {
        if (!val)
          return unref(initialValue)

        const decryptValue: IAppStorageData<T> = JSON.parse(
          encrypt ? AppPersistEncryption.decrypt(val) : val,
        )

        if (!decryptValue) {
          storage.removeItem(realKey)
          return unref(initialValue)
        }

        const { v, e } = decryptValue

        // not expire yet
        // or exipre is Infinity
        if (!e || new Date().getTime() <= e) {
          return v
        }
        else {
          storage.removeItem(realKey)
          return unref(initialValue)
        }
      },

      write: (val) => {
        let expireTime = 0

        const target = storage.getItem(realKey)

        try {
          const parsedData: IAppStorageData<T> = JSON.parse(encrypt ? AppPersistEncryption.decrypt(target) : target)

          if (parsedData && parsedData.e) {
            expireTime = parsedData.e
          }
        }
        catch {
          expireTime = new Date().getTime() + expire * 1000
        }

        const data: IAppStorageData<T> = {
          v: val,
          _v: version,
          e: expire === Infinity ? null : expireTime,
          enc: encrypt,
        }

        const str = JSON.stringify(data)
        return encrypt ? AppPersistEncryption.encrypt(str)! : str
      },
    },

  })
}
