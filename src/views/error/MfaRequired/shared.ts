// get friendly error message
export function getWebAuthnErrorMessage(error: any): string {
  const errorName = error?.name || ''
  const errorMessage = error?.message || ''

  const t = AppI18n().global.t

  switch (errorName) {
    case 'NotAllowedError':
      return t('mfa.webauthn.NotAllowedError')
    case 'InvalidStateError':
      return t('mfa.webauthn.InvalidStateError')
    case 'NotSupportedError':
      return t('app.base.error.notSupported')
    case 'SecurityError':
      return t('app.base.error.https')
    case 'AbortError':
      return t('app.base.error.abort')
    case 'TimeoutError':
      return t('app.base.error.timeout')
    case 'NetworkError':
      return t('app.base.error.network')
    default:
      return errorMessage
  }
}
