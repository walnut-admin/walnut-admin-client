import { urlQueryEncrypt } from '@/router/guard/modules/encrypt/querys'

export function useRouterQuery(path: string, defaultValue?: string) {
  const route = useAppRoute()
  const router = useAppRouter()
  const appSettingScope = useAppStoreSettingScope()

  /**
   * Get plaintext query value
   */
  const getResolvedValue = () => {
    // functional status || check maskUrl real value
    if (!appSettingScope.getMaskUrlStatus || !appSettingScope.getMaskUrlValue(route))
      return route.query[path]

    return (route.meta?._resolvedQuerys ?? {})[path] ?? defaultValue
  }

  /**
   * Set plaintext query value
   */
  const setResolvedValue = async (val?: string) => {
    if (!appSettingScope.getMaskUrlStatus || !appSettingScope.getMaskUrlValue(route)) {
      // In normal mode, directly write plaintext query
      router.replace({
        ...router.currentRoute.value,
        query: {
          ...router.currentRoute.value.query,
          [path]: val,
        },
      })
    }
    else {
      // 1. Get currently decrypted query
      const resolved = { ...(route.meta?._resolvedQuerys ?? {}) }

      // 2. Modify the value corresponding to the path
      if (val == null) {
        delete resolved[path]
      }
      else {
        resolved[path] = val
      }

      // 3. Re-encrypt the entire object
      const encryptedQuery = await urlQueryEncrypt(JSON.stringify(resolved))

      // 4. Write to _e
      router.replace({
        ...router.currentRoute.value,
        query: {
          _e: encryptedQuery,
        },
      })
    }
  }

  const routeQuery = computed<string | undefined>({
    get: () => getResolvedValue(),
    set: (val) => {
      void setResolvedValue(val ?? undefined)
    },
  })

  return routeQuery
}
