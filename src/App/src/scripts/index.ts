import { setupGoogleAnalytics } from './analytics'
import { setupDevice } from './device'

const appStoreSecurity = useAppStoreSecurity()
const appStoreFingerprint = useAppStoreFingerprint()
const appStoreGeoIP = useAppStoreGeoIP()

export async function setupAppScripts() {
  await appStoreFingerprint.setupFingerprint()

  // TODO below to should merge as setupDevice
  await appStoreGeoIP.setupGeoIP()
  await setupDevice()

  await appStoreSecurity.setupSign()

  await setupGoogleAnalytics()
}
