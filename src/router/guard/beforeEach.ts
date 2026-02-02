import type { Router } from 'vue-router'
import { isEmpty, isUndefined } from 'lodash-es'
import { AppCoreFn1 } from '@/core'
import { mainoutConst, mainoutMissingPermissionsRoute } from '../routes/mainout'

export function createBeforeEachGuard(router: Router) {
  router.beforeEach(async (to, _from) => {
    const userStoreAuth = useAppStoreUserAuth()
    const appStoreMenu = useAppStoreMenu()
    const appStoreRoute = useAppStoreRoute()

    // white list paths will enter directly
    if (appStoreRoute.isPathInWhiteList(to.path)) {
      // Login and push to auth page, will go index menu
      if (userStoreAuth.getAccessToken && to.path === mainoutConst.auth.path)
        return { name: appStoreMenu.getIndexMenuName }
      return true
    }

    // since almost all the routes are fetch from backend
    // default _auth would be undefined
    // this flag below should only works for hard-coded routes in frontend codes
    // no need to excute the logic below, like profile or permisison
    if (!isUndefined(to.meta?._auth) && !to.meta._auth)
      return true

    // No token, next to auth page and return
    if (!userStoreAuth.getAccessToken)
      return { path: mainoutConst.auth.path, replace: true }

    // Get user info
    const userStoreProfile = useAppStoreUserProfile()
    if (isEmpty(userStoreProfile.profile)) {
      // fetch profile
      await userStoreProfile.getProfile()
      // LINK https://router.vuejs.org/guide/advanced/dynamic-routing.html#adding-routes-inside-navigation-guards
      return to.fullPath
    }

    // user locked, early return
    const appStoreLock = useAppStoreLock()
    if (appStoreLock.getLocked) {
      return true
    }

    // not locked => Get permission
    if (isEmpty((appStoreMenu.menus))) {
      // At this step, user has login but didn't got dynamic routes generated
      // Below we call app core fn1 to handle logic
      const hasPermissions = await AppCoreFn1()

      // If no permissions, redirect to missing permissions page
      if (!hasPermissions) {
        const { addRoute, hasRoute } = useAppRouter()
        if (!hasRoute(mainoutConst.missingPermissions.name))
          addRoute(mainoutConst.root.name, mainoutMissingPermissionsRoute)
        return { name: mainoutConst.missingPermissions.name, replace: true }
      }

      // LINK https://router.vuejs.org/guide/advanced/dynamic-routing.html#adding-routes-inside-navigation-guards
      return to.fullPath
    }
  })
}
