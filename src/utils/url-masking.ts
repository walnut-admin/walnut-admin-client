import { AppUrlEncryption } from '@/utils/crypto'
import { version } from '~build/package'

const ENHANCED_URL_PREFIX = `__ep__${version}__`

export function isUrlEncrypted(v: unknown): v is string {
  return typeof v === 'string' && v.startsWith(ENHANCED_URL_PREFIX)
}

export function urlEncrypt(v: unknown) {
  return ENHANCED_URL_PREFIX + AppUrlEncryption.encrypt(v)
}

export function urlDecrypt(v: string) {
  return AppUrlEncryption.decrypt(v.slice(ENHANCED_URL_PREFIX.length))
}
