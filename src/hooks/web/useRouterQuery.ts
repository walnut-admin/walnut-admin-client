import { urlQueryEncrypt } from '@/router/guard/modules/encrypt/querys'

export function useRouterQuery(path: string, defaultValue?: string) {
  const route = useAppRoute()
  const router = useAppRouter()
  const appSetting = useAppStoreSetting()

  /**
   * Get plaintext query value
   */
  const getResolvedValue = () => {
    let val: string | undefined
    if (appSetting.app.urlMasking) {
      val = (route.meta?._resolvedQuerys ?? {})[path]
    }
    else {
      val = (route.query[path] ?? route.params[path]) as string | undefined
    }
    return val ?? defaultValue
  }

  /**
   * Set plaintext query value
   */
  const setResolvedValue = async (val?: string) => {
    if (appSetting.app.urlMasking) {
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
    else {
      // In normal mode, directly write plaintext query
      router.replace({
        ...router.currentRoute.value,
        query: {
          ...router.currentRoute.value.query,
          [path]: val,
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
