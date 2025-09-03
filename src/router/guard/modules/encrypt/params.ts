import type { Router } from 'vue-router'
import { decryptUrlMasking, encryptUrlMasking } from '@/router/utils/crypto'
import { version } from '~build/package'

const ENHANCED_URL_PREFIX = `__ep__${version}__`

function isUrlEncrypted(v: unknown): v is string {
  return typeof v === 'string' && v.startsWith(ENHANCED_URL_PREFIX)
}

async function urlEncrypt(v: string) {
  return ENHANCED_URL_PREFIX + await encryptUrlMasking(v)
}

async function urlDecrypt(v: string) {
  return await decryptUrlMasking(v.slice(ENHANCED_URL_PREFIX.length))
}

export function createRouteParamEncryptGuard(router: Router) {
  const appSetting = useAppStoreSetting()

  // beforeEach
  router.beforeEach(async (to, _from) => {
    // normal params
    if (!appSetting.app.urlMasking) {
      return true
    }

    // no name => refresh page
    // to.name redirect
    // route params enhancing
    if (!router.currentRoute.value.name || to.name === AppRedirectName)
      return true

    const needEncrypt = Object.entries(to.params)
      .filter(([, v]) => typeof v === 'string' && !isUrlEncrypted(v))

    if (!needEncrypt.length)
      return true

    const encrypted = { ...to.params }
    await Promise.all(needEncrypt.map(async ([k, v]) => {
      encrypted[k] = await urlEncrypt(v as string)
    }))
    return { ...to, params: encrypted, replace: true }
  })

  // beforeResolve
  router.beforeResolve(async (to) => {
    // normal params
    if (!appSetting.app.urlMasking) {
      return true
    }

    // to.name redirect
    if (to.name === AppRedirectName)
      return true

    const encryptedEntries = Object.entries(to.params)
      .filter(([, v]) => isUrlEncrypted(v))

    if (!encryptedEntries.length)
      return

    const resolved = { ...to.params }
    await Promise.all(encryptedEntries.map(async ([k, v]) => {
      resolved[k] = await urlDecrypt(v as string)
    }))

    to.meta._resolvedParams = resolved
  })
}
