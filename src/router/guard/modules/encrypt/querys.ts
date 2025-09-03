import type { Router } from 'vue-router'
import { decryptUrlMasking, encryptUrlMasking } from '@/router/utils/crypto'
import { version } from '~build/package'

const ENHANCED_URL_PREFIX = `__eq__${version}__`

function isUrlEncrypted(v: unknown): v is string {
  return typeof v === 'string' && v.startsWith(ENHANCED_URL_PREFIX)
}

async function urlEncrypt(v: string) {
  return ENHANCED_URL_PREFIX + await encryptUrlMasking(v)
}

async function urlDecrypt(v: string) {
  return await decryptUrlMasking(v.slice(ENHANCED_URL_PREFIX.length))
}

export function createRouteQueryEncryptGuard(router: Router) {
  const appSetting = useAppStoreSetting()

  router.beforeEach(async (to, _from) => {
    if (appSetting.app.urlMasking) {
      if (Object.keys(to.query).length && !isUrlEncrypted(to.query._e)) {
        const encryptedQuery = await urlEncrypt(JSON.stringify(to.query))
        return { ...to, query: { _e: encryptedQuery }, replace: true }
      }
    }
    return true
  })

  router.beforeResolve(async (to) => {
    if (appSetting.app.urlMasking && to.query._e) {
      const query = await urlDecrypt(to.query._e as string)
      const queryObj = JSON.parse(query)
      to.meta._resolvedQuerys = queryObj
    }
  })
}
