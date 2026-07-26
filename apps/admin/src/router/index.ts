import type { App } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuard } from './guard'
import { builtinRoutes } from './routes/builtin'
import { parseQuery, stringifyQuery } from './utils/query'

export const AppRouter = createRouter({
  history: createWebHistory(),
  routes: builtinRoutes,
  strict: true,
  stringifyQuery,
  parseQuery,
})

export function setupRouter(app: App) {
  app.use(AppRouter)
  createRouterGuard(AppRouter)
  // turbo-console-disable-next-line
  console.info('Router', 'Router Initializing...')
  return AppRouter
}

export function useAppRoute() {
  return useRoute()
}

export function useAppRouter() {
  if (!getCurrentInstance()) {
    return AppRouter
  }

  return useRouter()
}

export async function useAppRouterPush(info: RouteLocationRaw) {
  try {
    return await AppRouter.push(info)
  }
  catch (error) {
    console.error('Router push', error)
    useAppMessage().warning(AppI18n().global.t('app.menu.error'))
    window.$loadingBar?.finish()
  }
}
