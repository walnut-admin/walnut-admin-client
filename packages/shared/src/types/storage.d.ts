declare global {
  interface IStorageSync extends Storage {}

  interface IStorageAsync extends Exclude<Storage, 'getItem' | 'setItem'> {
    getItem: (key: string) => string | null | Promise<string | null>
    setItem: (key: string, value: string) => void | Promise<void>
  }

  interface IStorageOptions<T> {
    /**
     * expire time（milliseconds），Infinity means never expire
     * @default Infinity
     */
    expire?: number
    /**
     * any object that implements the Storage interface
     * @default syncLocalStorage/asyncLocalStorage
     */
    storage?: T
    /**
     * whether to use preset key
     * @default true
     */
    usePresetKey?: boolean
    /**
     * ttl mode
     * @default 'fixed'
     */
    ttlMode?: 'fixed' | 'sliding'
    /**
     * reset behavior
     * @default 'clear'
     */
    resetBehavior?: 'clear' | 'keepInitial'
  }

  interface IStorageData<T> {
    /** real value */
    v: T

    /** app version */
    _v: string

    /** expire time (milliseconds)，null means won't expire */
    e: number | null
  }
}

export {}
