import { initialDeviceAPI } from '@/api/system/device'

export async function setupDevice() {
  await initialDeviceAPI()
}
