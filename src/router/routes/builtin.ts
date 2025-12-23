import type { RouteRecordRaw, RouteRecordSingleView, RouteRecordSingleViewWithChildren } from 'vue-router'
import * as constant from '../constant'

export const AppAuthRoute: RouteRecordSingleView = {
  name: constant.AppAuthName,
  path: constant.AppAuthPath,
  component: () => import('../../views/auth/index.vue'),
  meta: {
    title: 'sys.menu.auth',
    _auth: false,
  },
}

export const AppAuthPrivacyPolicyRoute: RouteRecordSingleView = {
  name: constant.AppAuthPrivacyPolicyName,
  path: constant.AppAuthPrivacyPolicyPath,
  component: () => import('../../views/auth/privacy-policy.vue'),
  meta: {
    title: 'form.app.auth.pp',
    _auth: false,
  },
}

export const AppAuthServiceAgreementRoute: RouteRecordSingleView = {
  name: constant.AppAuthServiceAgreementName,
  path: constant.AppAuthServiceAgreementPath,
  component: () => import('../../views/auth/service-agreement.vue'),
  meta: {
    title: 'form.app.auth.sa',
    _auth: false,
  },
}

export const AppRootRoute: RouteRecordSingleViewWithChildren = {
  name: constant.AppRootName,
  path: constant.AppRootPath,
  component: () => import('../../layout/default'),
  // the redirect prop would be set in app core function
  children: [],
}

export const AppRedirectRoute: RouteRecordSingleView = {
  name: constant.AppRedirectName,
  path: `${constant.AppRedirectPath}/:path(.*)`,
  component: () => import('../../layout/default/TheRedirect/index.vue'),
}

// this is added dynamically base on the app setting
export const AppLockRoute: RouteRecordSingleView = {
  name: constant.AppLockName,
  path: constant.AppLockPath,
  component: () => import('../../components/App/AppLock/lock.vue'),
  meta: {
    title: 'sys.menu.lock',
  },
}

// below 404/500 routes are added after permission routes loaded
export const App404Route: RouteRecordSingleView = {
  name: constant.App404Name,
  path: constant.App404Path,
  component: () => import('../../views/error/404/index.vue'),
}

export const App500Route: RouteRecordSingleView = {
  name: constant.App500Name,
  path: constant.App500Path,
  component: () => import('../../views/error/500/index.vue'),
}

export const AppNotAllowedRoute: RouteRecordSingleView = {
  name: constant.AppNotAllowedName,
  path: constant.AppNotAllowedPath,
  component: () => import('../../views/error/NotAllowed/index.vue'),
}

export const builtinRoutes: RouteRecordRaw[] = [
  AppAuthRoute,
  AppAuthPrivacyPolicyRoute,
  AppAuthServiceAgreementRoute,
  AppRootRoute,
  AppRedirectRoute,
  AppNotAllowedRoute,
  // fix router warning
  App404Route,
  App500Route,
]
