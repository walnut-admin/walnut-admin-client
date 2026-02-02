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
  lock: {
    path: '/lock',
    name: 'Lock',
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

export const mainoutExternalLinkRoute: RouteRecordRaw = {
  name: mainoutConst.openExternal.name,
  path: mainoutConst.openExternal.path,
  component: () => import('../../views/features/external-link.vue'),
  meta: {
    _auth: true,
  },
}

export const mainoutNotAllowedRoute: RouteRecordSingleView = {
  name: mainoutConst.notAllowed.name,
  path: mainoutConst.notAllowed.path,
  component: () => import('../../views/error/NotAllowed/index.vue'),
  meta: {
    title: 'app.base.notAllowed',
    _auth: true,
  },
}

export const mainoutLockRoute: RouteRecordSingleView = {
  name: mainoutConst.lock.name,
  path: mainoutConst.lock.path,
  component: () => import('../../components/App/AppLock/lock.vue'),
  meta: {
    title: 'app.intro.lock',
    _auth: true,
  },
}

export const mainoutMfaRequiredRoute: RouteRecordSingleView = {
  name: mainoutConst.mfaRequired.name,
  path: mainoutConst.mfaRequired.path,
  component: () => import('../../views/error/MfaRequired/index.vue'),
  meta: {
    title: 'sys.menu.mfaRequired',
    _auth: true,
  },
}

export const mainoutMfaVerifiedRoute: RouteRecordSingleView = {
  name: mainoutConst.mfaVerified.name,
  path: mainoutConst.mfaVerified.path,
  component: () => import('../../views/error/MfaVerified/index.vue'),
  meta: {
    title: 'sys.menu.mfaVerified',
    _auth: true,
  },
}

export const mainoutMissingPermissionsRoute: RouteRecordSingleView = {
  name: mainoutConst.missingPermissions.name,
  path: mainoutConst.missingPermissions.path,
  component: () => import('../../views/error/MissingPermissions/index.vue'),
  meta: {
    title: 'sys.menu.missingPermissions',
    _auth: true,
  },
}

export const mainoutRoutes: RouteRecordRaw[] = [
  AppAuthRoute,
  AppAuthPrivacyPolicyRoute,
  AppAuthServiceAgreementRoute,
  testMainoutRoute,
  testFrontAuthRoute,
  splashCursorRoute,
]

export const mainoutRootRoute: RouteRecordRaw = {
  name: mainoutConst.root.name,
  path: mainoutConst.root.path,
  component: () => import('../../layout/mainout/index.vue'),
  children: mainoutRoutes,
}
