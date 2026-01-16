import type { RouteRecordRaw, RouteRecordSingleView } from 'vue-router'

export const mainoutConst = {
  root: {
    path: '/',
    name: 'Mainout',
  },
  auth: {
    path: '/auth',
    name: 'Auth',
  },
  privacyPolicy: {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
  },
  serviceAgreement: {
    path: '/service-agreement',
    name: 'ServiceAgreement',
  },
  testMainout: {
    path: '/test-mainout',
    name: 'TestMainout',
  },
  openExternal: {
    path: '/external-link',
    name: 'ExternalLink',
  },
  testFrontAuth: {
    path: '/test-front-auth',
    name: 'TestFrontAuth',
  },
  splashCursor: {
    path: '/splash-cursor',
    name: 'SplashCursor',
  },
  notAllowed: {
    path: '/not-allowed',
    name: 'AppErrorNotAllowed',
  },
  mfaRequired: {
    path: '/mfa-required',
    name: 'MfaRequired',
  },
  mfaVerified: {
    path: '/mfa-verified',
    name: 'MfaVerified',
  },
  missingPermissions: {
    path: '/missing-permissions',
    name: 'AppErrorMissingPermissions',
  },
} as const

const AppAuthRoute: RouteRecordSingleView = {
  name: mainoutConst.auth.name,
  path: mainoutConst.auth.path,
  component: () => import('../../views/auth/index.vue'),
  meta: {
    title: 'sys.menu.auth',
    _auth: false,
  },
}

const AppAuthPrivacyPolicyRoute: RouteRecordSingleView = {
  name: mainoutConst.privacyPolicy.name,
  path: mainoutConst.privacyPolicy.path,
  component: () => import('../../views/auth/privacy-policy.vue'),
  meta: {
    title: 'form.app.auth.pp',
    _auth: false,
  },
}

const AppAuthServiceAgreementRoute: RouteRecordSingleView = {
  name: mainoutConst.serviceAgreement.name,
  path: mainoutConst.serviceAgreement.path,
  component: () => import('../../views/auth/service-agreement.vue'),
  meta: {
    title: 'form.app.auth.sa',
    _auth: false,
  },
}

const testMainoutRoute: RouteRecordRaw = {
  name: mainoutConst.testMainout.name,
  path: mainoutConst.testMainout.path,
  component: () => import('../../views/features/test-mainout.vue'),
  meta: {
    _auth: false,
  },
}

const externalLinkRoute: RouteRecordRaw = {
  name: mainoutConst.openExternal.name,
  path: mainoutConst.openExternal.path,
  component: () => import('../../views/features/external-link.vue'),
  meta: {
    _auth: true,
  },
}

const testFrontAuthRoute: RouteRecordRaw = {
  name: mainoutConst.testFrontAuth.name,
  path: mainoutConst.testFrontAuth.path,
  component: () => import('../../views/features/test-frontAuth.vue'),
  meta: {
    _auth: true,
  },
}

// for fun
const splashCursorRoute: RouteRecordRaw = {
  name: mainoutConst.splashCursor.name,
  path: mainoutConst.splashCursor.path,
  component: () => import('../../views/features/splash-cursor.vue'),
  meta: {
    _auth: false,
  },
}

const AppNotAllowedRoute: RouteRecordSingleView = {
  name: mainoutConst.notAllowed.name,
  path: mainoutConst.notAllowed.path,
  component: () => import('../../views/error/NotAllowed/index.vue'),
  meta: {
    _auth: true,
  },
}

const AppMfaRequiredRoute: RouteRecordSingleView = {
  name: mainoutConst.mfaRequired.name,
  path: mainoutConst.mfaRequired.path,
  component: () => import('../../views/error/MfaRequired/index.vue'),
  meta: {
    _auth: true,
  },
}

const AppMfaVerifiedRoute: RouteRecordSingleView = {
  name: mainoutConst.mfaVerified.name,
  path: mainoutConst.mfaVerified.path,
  component: () => import('../../views/error/MfaVerified/index.vue'),
  meta: {
    _auth: true,
  },
}

const AppMissingPermissionsRoute: RouteRecordSingleView = {
  name: mainoutConst.missingPermissions.name,
  path: mainoutConst.missingPermissions.path,
  component: () => import('../../views/error/MissingPermissions/index.vue'),
  meta: {
    _auth: true,
  },
}

export const mainoutRoutes: RouteRecordRaw[] = [
  AppAuthRoute,
  AppAuthPrivacyPolicyRoute,
  AppAuthServiceAgreementRoute,
  testMainoutRoute,
  externalLinkRoute,
  testFrontAuthRoute,
  splashCursorRoute,
  AppNotAllowedRoute,
  AppMfaRequiredRoute,
  AppMfaVerifiedRoute,
  AppMissingPermissionsRoute,
]

export const mainoutRootRoute: RouteRecordRaw = {
  name: mainoutConst.root.name,
  path: mainoutConst.root.path,
  component: () => import('../../layout/mainout/index.vue'),
  children: mainoutRoutes,
}
