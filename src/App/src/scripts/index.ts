import { useAppStoreSign } from '@/store/modules/app/app-sign'
import { setupGoogleAnalytics } from './analytics'
import { setupDevice } from './device'
import { setupFingerprint } from './fingerprint'
import { setupGeoIP } from './geoip'

const appSign = useAppStoreSign()

export async function setupAppScripts() {
  await setupFingerprint()

  await setupGeoIP()

  await setupDevice()

  await appSign.setupSign()

  await setupGoogleAnalytics()
}
