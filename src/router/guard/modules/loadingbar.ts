import type { Router } from 'vue-router'

export function createLoadingbarGuard(router: Router) {
  const appStoreCachedViews = useAppStoreCachedViews()

  // beforeEach
  router.beforeEach((to, from) => {
    // if the target is not cached before, start loadingbar
    // also when from do not want leave tip, start loadingbar
    if (!appStoreCachedViews.hasCached(to.name) && !from.meta.leaveTip) {
      window.$loadingBar.start()
    }
  })

  // afterEach
  router.afterEach(() => {
    // finish loadingbar
    window.$loadingBar.finish()
  })
}
