import type { Router, RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'
import { AppUrlEncryption } from '@/utils/crypto'

function encryptDynamicPath(plain: string) {
  const tokens = plain.match(/\/|:([^/]+)|[^/:]+/g) || []

  const encryptedTokens = tokens.map((t) => {
    if (t === '/' || t.startsWith(':'))
      return t

    return AppUrlEncryption.encrypt(t)
  })

  return plain.startsWith('/')
    ? encryptedTokens.join('')
    : `/${encryptedTokens.join('')}`
}

const appSetting = useAppStoreSetting()

export function patchRouter(router: Router) {
  if (!appSetting.app.urlMasking) {
    return
  }

  // Save the original methods
  const rawAddRoute = router.addRoute.bind(router)

  // Intercept addRoute
  router.addRoute = function (...args: any[]) {
    let [parentName, route] = args as [NonNullable<RouteRecordNameGeneric>, RouteRecordRaw]
    // Support two calling forms
    if (args.length === 1) {
      route = args[0]
    }
    // Encrypt path
    if (route.path) {
      route.path = encryptDynamicPath(route.path)
    }
    // Recursively process children
    if (route.children) {
      route.children.forEach((child) => {
        if (child.path)
          child.path = encryptDynamicPath(route.path)
      })
    }
    return rawAddRoute(parentName, route)
  }
}
