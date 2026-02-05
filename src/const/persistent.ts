import type { ValueOf } from 'easy-fns-ts'

export const AppConstPersistKey = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REMEMBER: 'REMEMBER',

  DARK_MODE: 'DARK_MODE',

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
  SIGN_AES_KEY: 'SIGN_AES_KEY',
  AUTH_SESSION_KEY: 'AUTH_SESSION_KEY',

  // geo ip info
  GEO_IP_DEVICE_ID: 'GEO_IP_DEVICE_ID',
  GEO_IP_GEO_INFO: 'GEO_IP_GEO_INFO',

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
