import type { Router } from 'vue-router'
import { AppLockRoute } from '@/router/routes/builtin'

export function createLockGuard(router: Router) {
  const appStoreLock = useAppStoreLock()
  const appStoreMenu = useAppStoreMenu()

  // beforeEach
  router.beforeEach((to) => {
    // 1. If already on the lock screen page, allow direct passage
    if (to.name === AppLockName)
      return true

    // 2. Locked status && target lock route is specified
    if (appStoreLock.getLocked && appStoreLock.getLockRoute) {
      // Route not registered
      if (!router.hasRoute(AppLockName)) {
        router.addRoute(AppLockRoute)
        // Use the method recommended in docs: Return original "to" path to trigger re-matching after route addition
        return to.fullPath
      }

      // Route already registered, but current "to" is not the lock screen page
      if (to.name !== AppLockName) {
        return { name: AppLockName, replace: true }
      }
    }

    // 3. Unlocked status but still on lock screen page → redirect to homepage
    if (!appStoreLock.getLocked && router.hasRoute(AppLockName) && to.name === AppLockName) {
      return { name: appStoreMenu.getIndexMenuName, replace: true }
    }

    // 4. Allow normal passage by default
    return true
  })
}
