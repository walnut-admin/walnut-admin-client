import { AppAxios } from '@/utils/axios'
import { detectDeviceType, getCPUCoreCount, getGPUArchitecture, getMemoryGB } from '@/utils/shared'
import { BaseAPI } from '../base'

const appFingerprint = useAppStoreFingerprint()
const appGeoIP = useAppStoreGeoIP()

export const deviceAPI = new BaseAPI<AppSystemDictType>({
  model: 'system',
  section: 'device',
})

/**
 * @description initial device
 */
export async function initialDeviceAPI() {
  return AppAxios.post<{ deviceId: string }>({
    url: '/system/device/initial',
    data: {
      rawDeviceId: appFingerprint.getFingerprint,
      deviceName: `${detectDeviceType()}_${appFingerprint.getFingerprint.slice(0, 6)}`.toLocaleUpperCase(),
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
      ipHistory: [appGeoIP.getGeoInfo.ip],
      geoLocation: {
        type: 'Point',
        coordinates: [appGeoIP.getGeoInfo.longitude, appGeoIP.getGeoInfo.latitude],
      },
      deviceInfo: {
        // @ts-expect-error https://developer.mozilla.org/zh-CN/docs/Web/API/NetworkInformation/effectiveType
        netType: navigator.connection?.effectiveType,
        platform: navigator.platform,
        isp: appGeoIP.getGeoInfo.isp,
      },
      locationInfo: {
        country: appGeoIP.getGeoInfo.country,
        city: appGeoIP.getGeoInfo.city,
        region: appGeoIP.getGeoInfo.region,
      },
    } as AppSystemDevice,
  })
}
