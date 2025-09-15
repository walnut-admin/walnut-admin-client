import type { Router } from 'vue-router'
import { AppLockRoute } from '@/router/routes/builtin'

export function createLockGuard(router: Router) {
  const appStoreLock = useAppStoreLock()
  const appStoreMenu = useAppStoreMenu()

  // beforeEach
  router.beforeEach((to) => {
    if (appStoreLock.getLockStatus && appStoreLock.getLockRoute) {
      if (AppRouter.hasRoute(AppLockName)) {
        if (to.name !== AppLockName)
          return { name: AppLockName }
      }
      else {
        router.addRoute(AppLockRoute)
        return { name: AppLockName }
      }
    }

    if (AppRouter.hasRoute(AppLockName) && !appStoreLock.getLockStatus && to.name === AppLockName) {
      return { name: appStoreMenu.getIndexMenuName }
    }
  })
}
