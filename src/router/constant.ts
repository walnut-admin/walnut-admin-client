import { layoutConst } from './routes/builtin'
import { mainoutRoutes } from './routes/mainout'

/**
 * @description public route that enter directly
 */
export const routeWhiteListPath: string[] = [
  ...mainoutRoutes.filter(item => item.meta?._auth === false).map(item => item.path),
  layoutConst.notFound.path,
  layoutConst.serverError.path,
]
