import { name } from '~build/package'

export const getStorageKey = (key: string) => `${name.toLocaleUpperCase().slice(0, 1)}__${import.meta.env.MODE.slice(0, 3).toLocaleUpperCase()}__${key.replaceAll('-', '_').toLocaleUpperCase()}`
