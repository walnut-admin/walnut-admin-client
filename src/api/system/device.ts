import type { IModels } from '../models'
import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'
import { getCPUCoreCount, getGPUArchitecture, getIsInIncognitoMode, getMemoryGB } from '@/utils/shared'
import { BaseAPI } from '../base'

export const deviceAPI = new BaseAPI<IModels.SystemDevice>({
  model: 'system',
  section: 'device',
})

export function getDeviceCurrentActiveUserAPI(id: string) {
  return AppAxios.get<IResponseData.System.Device.CurrentActiveUser>(
    {
      url: `/system/device/${id}/current-active-user`,
    },
  )
}

export function getDeviceHistoryUsersAPI(id: string) {
  return AppAxios.get<IResponseData.System.Device.HistoryUsers>(
    {
      url: `/system/device/${id}/history-users`,
    },
  )
}

export function lockDeviceAPI(id: string) {
  return AppAxios.patch<boolean>(
    {
      url: `/system/device/${id}/lock`,
    },
  )
}

export function unlockDeviceAPI(id: string) {
  return AppAxios.patch<boolean>(
    {
      url: `/system/device/${id}/unlock`,
    },
  )
}

export function banDeviceAPI(id: string) {
  return AppAxios.patch<boolean>(
    {
      url: `/system/device/${id}/ban`,
    },
  )
}

export function unbanDeviceAPI(id: string) {
  return AppAxios.patch<boolean>(
    {
      url: `/system/device/${id}/unban`,
    },
  )
}

/**
 * @description initial device
 */
export async function initialDeviceAPI() {
  const appStoreFingerprint = useAppStoreFingerprint()

  return AppAxios.post<IResponseData.System.Device.Initial>({
    url: '/system/device/initial',
    data: {
      deviceName: appStoreFingerprint.getDeviceNameFromFingerprint,
      private: await getIsInIncognitoMode(),
      sr: {
        width: window.screen.width,
        height: window.screen.height,
      },
      vp: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      hardwareInfo: {
        cpuCores: getCPUCoreCount(),
        memory: getMemoryGB(),
        gpu: await getGPUArchitecture(),
      },
      deviceInfo: {
        // @ts-expect-error https://developer.mozilla.org/zh-CN/docs/Web/API/NetworkInformation/effectiveType
        netType: navigator.connection?.effectiveType,
        platform: navigator.platform,
      },
    } as IRequestPayload.System.Deivce.Initial,
  })
}
