import { setupGoogleAnalytics } from './analytics'
import { setupDevice } from './device'

const appStoreSecurity = useAppStoreSecurity()
const appStoreFingerprint = useAppStoreFingerprint()
const appStoreGeoIP = useAppStoreGeoIP()

export async function setupAppScripts() {
  await appStoreFingerprint.setupFingerprint()

  await appStoreGeoIP.setupGeoIP()

  await setupDevice()

  await appStoreSecurity.setupSign()

  await setupGoogleAnalytics()
}
