export const AppAuthPath = '/auth'
export const AppAuthName = 'Auth'

export const AppAuthPrivacyPolicyPath = '/auth/privacy-policy'
export const AppAuthPrivacyPolicyName = 'PrivacyPolicy'

export const AppAuthServiceAgreementPath = '/auth/service-agreement'
export const AppAuthServiceAgreementName = 'ServiceAgreement'

export const AppRootPath = '/'
export const AppRootName = 'Layout'

export const AppRedirectPath = '/redirect'
export const AppRedirectName = 'Redirect'

export const AppLockPath = '/lock'
export const AppLockName = 'Lock'

export const App404Path = '/:path(.*)*'
export const App404Name = 'App404'

export const App500Path = '/500'
export const App500Name = 'App500'

export const AppMissingPermissionsPath = '/missing-permissions'
export const AppMissingPermissionsName = 'AppErrorMissingPermissions'

export const AppNotAllowedPath = '/not-allowed'
export const AppNotAllowedName = 'AppErrorNotAllowed'

export const AppMfaRequiredPath = '/mfa-required'
export const AppMfaRequiredName = 'MfaRequired'

export const AppTestMainoutPath = '/test-mainout'
export const AppTestMainoutName = 'TestMainout'

export const AppTestFrontAuthPath = '/test-front-auth'
export const AppTestFrontAuthName = 'TestFrontAuth'

export const AppOpenExternalPath = '/external-link'
export const AppOpenExternalName = 'ExternalLink'

export const splashCursorPath = '/splash-cursor'
export const splashCursorName = 'SplashCursor'

/**
 * @description public route that enter directly
 */
export const routeWhiteListPath: string[] = [
  AppAuthPath,
  AppAuthPrivacyPolicyPath,
  AppAuthServiceAgreementPath,
  AppNotAllowedPath,
  AppMfaRequiredPath,
  AppMissingPermissionsPath,
  App404Path,
  App500Path,
]
