import type { Router } from 'vue-router'
import { decryptUrlMasking, encryptUrlMasking } from '@/router/utils/crypto'
import { version } from '~build/package'

const ENHANCED_URL_PREFIX = `__eq__${version}__`

function isUrlQueryEncrypted(v: unknown): v is string {
  return typeof v === 'string' && v.startsWith(ENHANCED_URL_PREFIX)
}

export async function urlQueryEncrypt(v: string) {
  return ENHANCED_URL_PREFIX + await encryptUrlMasking(v)
}

async function urlQueryDecrypt(v: string) {
  return await decryptUrlMasking(v.slice(ENHANCED_URL_PREFIX.length))
}

export function createRouteQueryEncryptGuard(router: Router) {
  const appSetting = useAppStoreSetting()

  router.beforeEach(async (to, _from) => {
    if (appSetting.app.urlMasking) {
      if (Object.keys(to.query).length && !isUrlQueryEncrypted(to.query._e)) {
        const encryptedQuery = await urlQueryEncrypt(JSON.stringify(to.query))
        return { ...to, query: { _e: encryptedQuery }, replace: true }
      }
    }
    return true
  })

  router.beforeResolve(async (to) => {
    if (appSetting.app.urlMasking && to.query._e) {
      const query = await urlQueryDecrypt(to.query._e as string)
      const queryObj = JSON.parse(query)
      to.meta._resolvedQuerys = queryObj
    }
  })
}
