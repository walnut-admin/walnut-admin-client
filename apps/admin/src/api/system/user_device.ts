import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import type { IAxios } from '@/utils/axios/types'
import { AppAxios } from '@/utils/axios'

const systemUserDevice = {
  LIST: '/system/user/device/list',
  UPDATE_NAME: '/system/user/device/update-name',
  FORCE_QUIT: '/system/user/device/force-quit',
  LOCK: '/system/user/device/lock',
  UNLOCK: '/system/user/device/unlock',
} as const

/**
 * @description list user's devices
 */
export function listUserDevicesAPI() {
  return AppAxios.get<IAxios.BaseListResponse<IResponseData.System.UserDevice.List>>({
    url: systemUserDevice.LIST,
  })
}

/**
 * @description update user device name
 */
export function updateUserDeviceNameAPI(data: IRequestPayload.System.UserDevice.UpdateName) {
  return AppAxios.put<boolean>({
    url: `${systemUserDevice.UPDATE_NAME}/${data.deviceId}`,
    data: {
      deviceName: data.deviceName,
    },
  })
}

/**
 * @description force quit user device
 */
export function forceQuitUserDeviceAPI(data: IRequestPayload.System.UserDevice.ForceQuit) {
  return AppAxios.delete<boolean>({
    url: `${systemUserDevice.FORCE_QUIT}/${data.deviceId}`,
  })
}

/**
 * @description lock user device
 */
export function lockUserDeviceAPI(data: IRequestPayload.System.UserDevice.Lock) {
  return AppAxios.put<boolean>({
    url: `${systemUserDevice.LOCK}/${data.deviceId}`,
  })
}

/**
 * @description unlock user device
 */
export function unlockUserDeviceAPI(data: IRequestPayload.System.UserDevice.Unlock) {
  return AppAxios.put<boolean>({
    url: `${systemUserDevice.UNLOCK}/${data.deviceId}`,
  })
}
