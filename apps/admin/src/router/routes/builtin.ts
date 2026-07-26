import type { RouteRecordRaw, RouteRecordSingleView, RouteRecordSingleViewWithChildren } from 'vue-router'
import { mainoutRootRoute } from './mainout'

export const layoutConst = {
  root: {
    path: '/',
    name: 'Layout',
  },
  redirect: {
    path: '/redirect',
    name: 'Redirect',
  },
  notFound: {
    path: '/:path(.*)*',
    name: 'App404',
  },
  serverError: {
    path: '/500',
    name: 'App500',
  },

} as const

export const AppRootRoute: RouteRecordSingleViewWithChildren = {
  name: layoutConst.root.name,
  path: layoutConst.root.path,
  component: () => import('../../layout/default'),
  // the redirect prop would be set in app core function
  children: [],
}

export const AppRedirectRoute: RouteRecordSingleView = {
  name: layoutConst.redirect.name,
  path: `${layoutConst.redirect.path}/:path(.*)`,
  component: () => import('../../layout/default/TheRedirect/index.vue'),
}

// below 404/500 routes are added after permission routes loaded
export const App404Route: RouteRecordSingleView = {
  name: layoutConst.notFound.name,
  path: layoutConst.notFound.path,
  component: () => import('../../views/error/404/index.vue'),
}

export const App500Route: RouteRecordSingleView = {
  name: layoutConst.serverError.name,
  path: layoutConst.serverError.path,
  component: () => import('../../views/error/500/index.vue'),
}

export const builtinRoutes: RouteRecordRaw[] = [
  AppRootRoute,
  mainoutRootRoute,
  AppRedirectRoute,
  // fix router warning
  App404Route,
  App500Route,
]
