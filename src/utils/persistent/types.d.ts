declare global {
  interface IStorageSync extends Storage {}

  interface IStorageAsync extends Exclude<Storage, 'getItem' | 'setItem'> {
    getItem: (key: string) => string | null | Promise<string | null>
    setItem: (key: string, value: string) => void | Promise<void>
  }

  interface IStorageOptions<T> {
    /* expire time（milliseconds），Infinity means never expire, default Infinity */
    expire?: number
    /* any object that implements the Storage interface, default localStorage */
    storage?: T
    /* whether to use preset key, default true */
    usePresetKey?: boolean
    /** ttl mode */
    ttlMode?: 'fixed' | 'sliding'
  }

  interface IStorageData<T> {
    /** real value */
    v: T

    /** app version */
    _v: string //

    /** expire time (milliseconds)，null means won't expire */
    e: number | null //
  }
}

export {}
