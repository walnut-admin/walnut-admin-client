import type { Router } from 'vue-router'
import { isEmpty, isUndefined } from 'lodash-es'
import { AppCoreFn1 } from '@/core'

export function createBeforeEachGuard(router: Router) {
  router.beforeEach(async (to, _from) => {
    const userStoreAuth = useAppStoreUserAuth()
    const appStoreMenu = useAppStoreMenu()

    // Paths in `routeWhiteListPath` will enter directly
    if (routeWhiteListPath.includes(to.path)) {
      // Login and push to auth page, will go index menu
      if (userStoreAuth.accessToken && to.path === AppAuthPath)
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
    if (!userStoreAuth.accessToken)
      return { path: AppAuthPath, replace: true }

    const userStoreProfile = useAppStoreUserProfile()
    // Get user info
    if (isEmpty(userStoreProfile.profile)) {
      // fetch profile
      await userStoreProfile.getProfile()
      // LINK https://router.vuejs.org/guide/advanced/dynamic-routing.html#adding-routes-inside-navigation-guards
      return to.fullPath
    }

    const appStoreLock = useAppStoreLock()
    // not locked => Get permission
    if (!appStoreLock.getLocked && isEmpty((appStoreMenu.menus))) {
      // At this step, user has login but didn't got dynamic routes generated
      // Below we call app core fn1 to handle logic
      await AppCoreFn1()
      // LINK https://router.vuejs.org/guide/advanced/dynamic-routing.html#adding-routes-inside-navigation-guards
      return to.fullPath
    }
  })
}
