import type { RouteLocationRaw } from 'vue-router'

export function useRouterParam(path: string) {
  const router = useAppRouter()
  const route = useAppRoute()
  const appSettingScope = useAppStoreSettingScope()

  const routeParam = computed({
    get() {
      if (!appSettingScope.getMaskUrlStatus || !appSettingScope.getMaskUrlValue(route))
        return route.params[path]

      return (route.meta?._resolvedParams ?? {})[path]
    },
    set(val) {
      router.replace({ ...router.currentRoute.value, params: { ...router.currentRoute.value.params, [path]: val } } as RouteLocationRaw)
    },
  })

  return routeParam
}
