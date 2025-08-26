import type { Router } from 'vue-router'
import { isUrlEncrypted, urlDecrypt, urlEncrypt } from '@/utils/url-masking'

export function createRouteParamsEnhancedGuard(router: Router) {
  const appSetting = useAppStoreSetting()

  // beforeEach
  router.beforeEach((to, _from) => {
    // normal params
    if (!appSetting.app.urlMasking) {
      return true
    }

    // no name => refresh page
    // to.name redirect
    // route params enhancing
    if (!router.currentRoute.value.name || to.name === AppRedirectName)
      return true

    const needEncrypt = Object.entries(to.params)
      .filter(([, v]) => typeof v === 'string' && !isUrlEncrypted(v))

    if (!needEncrypt.length)
      return true

    const encrypted = { ...to.params }
    needEncrypt.forEach(([k, v]) => {
      encrypted[k] = urlEncrypt(v as string)
    })
    return { ...to, params: encrypted, replace: true }
  })

  // beforeResolve
  router.beforeResolve((to) => {
    // normal params
    if (!appSetting.app.urlMasking) {
      return true
    }

    // to.name redirect
    if (to.name === AppRedirectName)
      return true

    const encryptedEntries = Object.entries(to.params)
      .filter(([, v]) => isUrlEncrypted(v))

    if (!encryptedEntries.length)
      return

    const resolved = { ...to.params }
    encryptedEntries.forEach(([k, v]) => {
      try {
        resolved[k] = urlDecrypt(v as string)
      }
      catch (error) {
        console.warn('Query decryption failed, fallback to empty', error)
        resolved[k] = '[invalid]'
      }
    })

    to.meta._resolvedParams = resolved
  })
}
