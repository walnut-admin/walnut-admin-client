export function useRouterQuery(path: string) {
  const route = useAppRoute()
  const router = useAppRouter()
  const appSetting = useAppStoreSetting()

  const routeQuery = computed({
    get() {
      if (appSetting.app.urlMasking) {
        return (route.meta?._resolvedQuerys ?? {})[path]
      }
      return route.params[path] as string ?? undefined
    },
    set(val) {
      router.replace({ ...router.currentRoute.value, query: { ...router.currentRoute.value.query, [path]: val } })
    },
  })

  return routeQuery
}
