import { initialDeviceAPI } from '@/api/system/device'

const appFingerprint = useAppStoreFingerprint()

export async function setupDevice() {
  if (appFingerprint.getFingerprint) {
    return
  }
  await initialDeviceAPI()
}
