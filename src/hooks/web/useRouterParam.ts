import type { RouteLocationRaw } from 'vue-router'

export function useRouterParam(path: string) {
  const router = useAppRouter()
  const route = useAppRoute()
  const appSetting = useAppStoreSetting()

  const routeParam = computed({
    get() {
      if (appSetting.app.urlMasking) {
        return (route.meta?._resolvedParams ?? {})[path]
      }
      return route.params[path] as string ?? undefined
    },
    set(val) {
      router.replace({ ...router.currentRoute.value, params: { [path]: val } } as RouteLocationRaw)
    },
  })

  return routeParam
}
