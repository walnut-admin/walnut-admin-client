import { setupGoogleAnalytics } from './analytics'
import { setupDevice } from './device'
import { setupGeoIP } from './geoip'

const appSign = useAppStoreSign()
const appFingerprint = useAppStoreFingerprint()

export async function setupAppScripts() {
  await appFingerprint.setupFingerprint()

  await setupGeoIP()

  await setupDevice()

  await appSign.setupSign()

  await setupGoogleAnalytics()
}
