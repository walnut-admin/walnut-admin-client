import { setupGoogleAnalytics } from './analytics'
import { setupDevice } from './device'

const appSign = useAppStoreSign()
const appFingerprint = useAppStoreFingerprint()
const appGeoIP = useAppStoreGeoIP()

export async function setupAppScripts() {
  await appFingerprint.setupFingerprint()

  await appGeoIP.setupGeoIP()

  await appSign.setupSign()

  await setupDevice()

  await setupGoogleAnalytics()
}
