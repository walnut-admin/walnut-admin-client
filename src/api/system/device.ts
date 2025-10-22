import type { IModels } from '../models'
import type { IRequestPayload } from '../request'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'
import { detectDeviceType, getCPUCoreCount, getGPUArchitecture, getMemoryGB } from '@/utils/shared'
import { BaseAPI } from '../base'

export const deviceAPI = new BaseAPI<IModels.SystemDevice>({
  model: 'system',
  section: 'device',
})

/**
 * @description initial device
 */
export async function initialDeviceAPI() {
  const appStoreFingerprint = useAppStoreFingerprint()
  const appStoreGeoIP = useAppStoreGeoIP()

  return AppAxios.post<IResponseData.System.Device.Initial>({
    url: '/system/device/initial',
    data: {
      rawDeviceId: appStoreFingerprint.getFingerprint,
      deviceName: `${detectDeviceType()}_${appStoreFingerprint.getFingerprint.slice(0, 6)}`.toLocaleUpperCase(),
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
      ipHistory: [appStoreGeoIP.getGeoInfo.ip],
      geoLocation: {
        type: 'Point',
        coordinates: [appStoreGeoIP.getGeoInfo.longitude, appStoreGeoIP.getGeoInfo.latitude],
      },
      deviceInfo: {
        // @ts-expect-error https://developer.mozilla.org/zh-CN/docs/Web/API/NetworkInformation/effectiveType
        netType: navigator.connection?.effectiveType,
        platform: navigator.platform,
        isp: appStoreGeoIP.getGeoInfo.isp,
      },
      locationInfo: {
        country: appStoreGeoIP.getGeoInfo.country,
        city: appStoreGeoIP.getGeoInfo.city,
        region: appStoreGeoIP.getGeoInfo.region,
      },
    } as IRequestPayload.System.Deivce.Initial,
  })
}
