import type { Router, RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'
import { deflateSync, strToU8 } from 'fflate'
import { Base64 } from 'js-base64'

function maskRoute(routeObj: any) {
  // 1. Convert to string
  const jsonString = JSON.stringify(routeObj)
  // 2. Compress
  const gz = deflateSync(strToU8(jsonString))
  // 3. Base64url encoding (safe for address bar)
  // true = remove padding, replace +/ with -_
  return Base64.fromUint8Array(gz, true)
}

function maskDynamicPath(plain: string) {
  const tokens = plain.match(/\/|:([^/]+)|[^/:]+/g) || []

  const encryptedPath = tokens.map((t) => {
    if (t === '/' || t.startsWith(':'))
      return t

    return maskRoute(t)
  })

  return plain.startsWith('/')
    ? encryptedPath.join('')
    : `/${encryptedPath.join('')}`
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
      route.path = maskDynamicPath(route.path)
    }
    // Recursively process children
    if (route.children) {
      route.children.forEach(async (child) => {
        if (child.path)
          child.path = maskDynamicPath(route.path)
      })
    }
    return rawAddRoute(parentName, route)
  }
}
