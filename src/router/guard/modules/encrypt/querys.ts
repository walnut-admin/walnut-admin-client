import type { Router } from 'vue-router'
import { version } from '~build/package'
import { decryptRouterUrl, encryptRouterUrl } from '@/router/utils/crypto'

const ENHANCED_URL_PREFIX = `__eq__${version}__`
const queryWhiteList = ['url']

function isUrlQueryEncrypted(v: unknown): v is string {
  return typeof v === 'string' && v.startsWith(ENHANCED_URL_PREFIX)
}

export async function urlQueryEncrypt(v: string) {
  return ENHANCED_URL_PREFIX + await encryptRouterUrl(v)
}

async function urlQueryDecrypt(v: string) {
  return await decryptRouterUrl(v.slice(ENHANCED_URL_PREFIX.length))
}

export function createRouteQueryEncryptGuard(router: Router) {
  const appSettingScope = useAppStoreSettingScope()

  router.beforeEach(async (to, _from) => {
    if (routeWhiteListPath.includes(to.path)) {
      return true
    }

    // functional status || check maskUrl real value
    if (!appSettingScope.getMaskUrlStatus || !appSettingScope.getMaskUrlValue(to))
      return true

    // 1. Split query parameters
    const whiteQuery: Record<string, any> = {}
    const normalQuery: Record<string, any> = {}
    Object.entries(to.query).forEach(([k, v]) => {
      ; (queryWhiteList.includes(k) ? whiteQuery : normalQuery)[k] = v
    })

    // 2. Encrypted package already exists (indicates redirect back), allow direct passage
    if (isUrlQueryEncrypted(to.query._e))
      return true

    // 3. Only whitelisted parameters → allow passage
    if (Object.keys(normalQuery).length === 0)
      return true

    // 4. Only non-whitelisted parameters → encrypt the entire package
    if (Object.keys(whiteQuery).length === 0) {
      const encrypted = await urlQueryEncrypt(JSON.stringify(normalQuery))
      return { ...to, query: { _e: encrypted }, replace: true }
    }

    // 5. Mixed case → whitelisted parameters in plaintext + non-whitelisted parameters encrypted
    const encrypted = await urlQueryEncrypt(JSON.stringify(normalQuery))
    return {
      ...to,
      query: { ...whiteQuery, _e: encrypted },
      replace: true,
    }
  })

  router.beforeResolve(async (to) => {
    if (routeWhiteListPath.includes(to.path)) {
      return true
    }

    // functional status || check maskUrl real value
    if (!appSettingScope.getMaskUrlStatus || !appSettingScope.getMaskUrlValue(to))
      return true

    if (to.query._e) {
      const query = await urlQueryDecrypt(to.query._e as string)
      if (query) {
        const queryObj = JSON.parse(query)
        to.meta._resolvedQuerys = queryObj
      }
    }
  })
}
