import type { ValueOf } from 'easy-fns-ts'

export const AppConstPersistKey = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REMEMBER: 'REMEMBER',

  DARK_MODE: 'DARK_MODE',

  LOCK_MODE: 'LOCK_MODE',
  IS_LOCK: 'IS_LOCK',
  LOCK_ROUTE: 'LOCK_ROUTE',

  LOCALE: 'LOCALE',
  CAPJS_TOKEN: 'CAPJS_TOKEN',
  FORCE_QUIT_SHOW: 'FORCE_QUIT_SHOW',

  TABS: 'TABS',

  SCROLL: 'SCROLL',

  // finger print
  FINGERPRINT: 'FINGERPRINT',

  // signature
  RSA_PRIVATE_KEY: 'RSA_PRIVATE_KEY',
  RSA_PUBLIC_KEY: 'RSA_PUBLIC_KEY',
  AES_KEY: 'AES_KEY',

  // geo ip info, fetch from EXTERNAL_LINKS.GEOIP
  GEO_IP_INFO: 'GEO_IP_INFO',

  // count down
  COUNTDOWN: 'COUNTDOWN_MAP',
} as const

export const AppConstStorageType = {
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
  COOKIES: 'cookies',
} as const

export type ValueOfAppConstPersistKey = ValueOf<typeof AppConstPersistKey>
export type ValueOfAppConstStorageType = ValueOf<typeof AppConstStorageType>
