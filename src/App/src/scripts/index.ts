import { setupGoogleAnalytics } from './analytics'
import { setupDevice } from './device'
import { setupFingerprint } from './fingerprint'
import { setupGeoIP } from './geoip'
import { setupSign } from './sign'

export async function setupAppScripts() {
  await setupFingerprint()

  await setupGeoIP()

  await setupDevice()

  await setupSign()

  await setupGoogleAnalytics()
}
