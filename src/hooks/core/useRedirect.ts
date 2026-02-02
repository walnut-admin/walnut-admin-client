import { layoutConst } from '@/router/routes/builtin'

/**
 * @description use redirect
 */
export function useRedirect(): Promise<boolean> {
  const { replace, currentRoute } = AppRouter

  const { query } = currentRoute.value

  const path = layoutConst.redirect.path + currentRoute.value.fullPath

  return new Promise(resolve =>
    replace({
      path,
      query,
    }).then(() => resolve(true)),
  )
}
