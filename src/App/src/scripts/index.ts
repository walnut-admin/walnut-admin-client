import { initialDeviceAPI } from '@/api/system/device'
import { setupGoogleAnalytics } from './analytics'

const appStoreSecurity = useAppStoreSecurity()
const appStoreFingerprint = useAppStoreFingerprint()
const appStoreGeoIP = useAppStoreGeoIP()

export async function setupAppScripts() {
  await appStoreFingerprint.setupFingerprint()

  // TODO geo ip info 24h expire ?
  await appStoreGeoIP.setupGeoIP()
  await initialDeviceAPI()

  await appStoreSecurity.setupSign()

  await setupGoogleAnalytics()
}
