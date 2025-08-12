import { setupGoogleAnalytics } from './analytics'
import { setupClientCert } from './cert'
import { setupDevice } from './device'
import { setupFingerprint } from './fingerprint'
import { setupGeoIP } from './geoip'

export async function setupAppScripts() {
  await setupClientCert()

  await setupGeoIP()

  await setupDevice()

  await setupFingerprint()

  await setupGoogleAnalytics()
}
