import type { Router } from 'vue-router'

export function createLockGuard(router: Router) {
  const appStoreLock = useAppStoreLock()
  const appStoreMenu = useAppStoreMenu()

  // beforeEach
  router.beforeEach((to) => {
    if (AppRouter.hasRoute(AppLockName) && appStoreLock.getLockStatus && appStoreLock.getLockRoute) {
      if (to.name !== AppLockName)
        return { name: AppLockName }
    }

    if (AppRouter.hasRoute(AppLockName) && !appStoreLock.getLockStatus && to.name === AppLockName) {
      return { name: appStoreMenu.getIndexMenuName }
    }
  })
}
