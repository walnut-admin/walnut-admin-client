import { initialDeviceAPI } from '@/api/system/device'
import { fpId } from '@/App/src/scripts/fingerprint'

export async function setupDevice() {
  if (fpId.value) {
    return
  }
  await initialDeviceAPI()
}
