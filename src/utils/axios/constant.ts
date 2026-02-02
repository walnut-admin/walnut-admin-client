export const BusinessCodeConst = {
  SUCCESS: 20000,

  RSA_DECRYPT_FAILED: 40011,
  RSA_PUB_KEY_NOT_FOUND: 40012,
  ACCESS_TOKEN_EXPIRED: 40101,
  REFRESH_TOKEN_EXPIRED: 40102,
  SIGNATURE_EXPIRED: 40113,
  MFA_REQUIRED: 40114,
  MFA_VERIFIED: 40115,
  CAPJS_TOKEN_INTERACTION_REQUIRED: 40116,
  CAPJS_TOKEN_REFRESH_REQUIRED: 40117,
  USER_LOCKED: 40118,
} as const

export const notAllowedErrorCodeMap: Record<number, string> = {
  40111: 'capjsTokenInvalid',
  40600: 'notAllowed',
  40601: 'os',
  40602: 'browser',
  40603: 'ip',
  40604: 'userAgent',
  40605: 'device',
  40606: 'deviceLocked',
  40607: 'deviceBanned',
  40666: 'riskTooHigh',
}
