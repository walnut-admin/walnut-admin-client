import { setupGoogleAnalytics } from './analytics'

export async function setupAppScripts() {
  await setupGoogleAnalytics()

  const appStoreFingerprint = useAppStoreFingerprint()
  await appStoreFingerprint.setupFingerprint()

  const appStoreGeoIP = useAppStoreGeoIP()
  await appStoreGeoIP.setupGeoIP()
  await appStoreGeoIP.setupDeviceId()

  const appStoreSecurity = useAppStoreSecurity()
  await appStoreSecurity.setupSign()
}
