import type { Router } from 'vue-router'
import { AppUrlEncryption } from '@/utils/crypto'
import { watob, wbtoa } from '@/utils/window/base64'

const ENHANCED_ROUTE_PARAMS_PREFIX = 'ep_'

export function createRouteParamsEnhancedGuard(router: Router) {
  const appSetting = useAppStoreSetting()

  const enhancedFn = {
    [AppConstRouteQueryEnhancedMode.BASE64]: wbtoa,
    [AppConstRouteQueryEnhancedMode.CRYPTOJS]: AppUrlEncryption.encrypt.bind(AppUrlEncryption),
  }

  const resolvedFn = {
    [AppConstRouteQueryEnhancedMode.BASE64]: watob,
    [AppConstRouteQueryEnhancedMode.CRYPTOJS]: AppUrlEncryption.decrypt.bind(AppUrlEncryption),
  }

  // beforeEach
  router.beforeEach((to, _from) => {
    // normal params
    if (appSetting.app.routeQueryMode === AppConstRouteQueryMode.NORMAL) {
      return true
    }

    // no name => refresh page
    // to.name redirect
    // route params enhancing
    if (!router.currentRoute.value.name || to.name === AppRedirectName)
      return true

    const hasUnenhancedParams = Object.keys(to.params).some((key) => {
      const value = to.params[key]
      return value && typeof value === 'string' && !value.startsWith(ENHANCED_ROUTE_PARAMS_PREFIX)
    })

    if (!hasUnenhancedParams)
      return true

    const encryptedParams = { ...to.params }
    Object.keys(encryptedParams).forEach((key) => {
      const value = encryptedParams[key]
      if (value && typeof value === 'string' && !value.startsWith(ENHANCED_ROUTE_PARAMS_PREFIX)) {
        encryptedParams[key] = ENHANCED_ROUTE_PARAMS_PREFIX + enhancedFn[appSetting.app.routeQueryEnhancedMode](value)
      }
    })
    return { ...to, params: encryptedParams, replace: true }
  })

  // beforeResolve
  router.beforeResolve((to) => {
    // normal params
    if (appSetting.app.routeQueryMode === AppConstRouteQueryMode.NORMAL) {
      return true
    }

    // to.name redirect
    if (to.name === AppRedirectName)
      return true

    const hasEncryptedParams = Object.keys(to.params).some((key) => {
      const value = to.params[key]
      return value && typeof value === 'string' && value.startsWith(ENHANCED_ROUTE_PARAMS_PREFIX)
    })

    if (!hasEncryptedParams)
      return true

    const resolvedParams = { ...to.params }
    Object.keys(resolvedParams).forEach((key) => {
      const value = resolvedParams[key]
      if (value && typeof value === 'string' && value.startsWith(ENHANCED_ROUTE_PARAMS_PREFIX)) {
        resolvedParams[key] = resolvedFn[appSetting.app.routeQueryEnhancedMode](value.replace(ENHANCED_ROUTE_PARAMS_PREFIX, ''))
      }
    })
    to.meta._resolvedParams = resolvedParams
  })
}
