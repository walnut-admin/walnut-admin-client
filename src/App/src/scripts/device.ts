import { initialDeviceAPI } from '@/api/system/device'

export async function setupDevice() {
  const appStoreGeoIP = useAppStoreGeoIP()

  // Ensure that the geo information is always up-to-date (idempotent, no duplicate requests)
  await appStoreGeoIP.setupGeoIP()

  // Now geoInfo must have values, directly create the device
  await initialDeviceAPI()
}
