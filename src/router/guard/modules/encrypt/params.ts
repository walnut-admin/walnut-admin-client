import type { Router } from 'vue-router'
import { version } from '~build/package'
import { decryptRouterUrl, encryptRouterUrl } from '@/router/utils/crypto'

const ENHANCED_URL_PREFIX = `__ep__${version}__`

function isUrlParamEncrypted(v: unknown): v is string {
  return typeof v === 'string' && v.startsWith(ENHANCED_URL_PREFIX)
}

async function urlParamEncrypt(v: string) {
  return ENHANCED_URL_PREFIX + await encryptRouterUrl(v)
}

async function urlParamDecrypt(v: string) {
  return await decryptRouterUrl(v.slice(ENHANCED_URL_PREFIX.length))
}

export function createRouteParamEncryptGuard(router: Router) {
  const appSettingScope = useAppStoreSettingScope()

  // beforeEach
  router.beforeEach(async (to, _from) => {
    // functional status || check maskUrl real value
    if (!appSettingScope.getMaskUrlStatus || !appSettingScope.getMaskUrlValue(to))
      return true

    // no name => refresh page
    // to.name redirect
    // route params enhancing
    if (!router.currentRoute.value.name || to.name === AppRedirectName)
      return true

    const needEncrypt = Object.entries(to.params)
      .filter(([, v]) => typeof v === 'string' && !isUrlParamEncrypted(v))

    if (!needEncrypt.length)
      return true

    const encrypted = { ...to.params }
    await Promise.all(needEncrypt.map(async ([k, v]) => {
      encrypted[k] = await urlParamEncrypt(v as string)
    }))
    return { ...to, params: encrypted, replace: true }
  })

  // beforeResolve
  router.beforeResolve(async (to) => {
    // functional status || check maskUrl real value
    if (!appSettingScope.getMaskUrlStatus || !appSettingScope.getMaskUrlValue(to))
      return true

    // to.name redirect
    if (to.name === AppRedirectName)
      return true

    const encryptedEntries = Object.entries(to.params)
      .filter(([, v]) => isUrlParamEncrypted(v))

    if (!encryptedEntries.length)
      return

    const resolved = { ...to.params }
    await Promise.all(encryptedEntries.map(async ([k, v]) => {
      const decrypted = await urlParamDecrypt(v as string)
      if (decrypted) {
        resolved[k] = decrypted
      }
    }))

    to.meta._resolvedParams = resolved
  })
}
