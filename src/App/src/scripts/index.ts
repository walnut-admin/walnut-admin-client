import { setupGoogleAnalytics } from './analytics'
import { setupDevice } from './device'

const appSign = useAppStoreSecurity()
const appFingerprint = useAppStoreFingerprint()
const appGeoIP = useAppStoreGeoIP()

export async function setupAppScripts() {
  await appFingerprint.setupFingerprint()

  // TODO below to should merge as setupDevice
  await appGeoIP.setupGeoIP()
  await setupDevice()

  await appSign.setupSign()

  await setupGoogleAnalytics()
}
