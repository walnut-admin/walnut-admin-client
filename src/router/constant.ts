import { layoutConst } from './routes/builtin'
import { mainoutRoutes } from './routes/mainout'

/**
 * @description public route that enter directly
 */
export const routeWhiteListPath: string[] = [
  ...mainoutRoutes.map(item => item.path),
  layoutConst.redirect.path,
  layoutConst.notFound.path,
  layoutConst.serverError.path,
]
