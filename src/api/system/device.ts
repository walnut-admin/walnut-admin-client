import { GeoIPInfo } from '@/App/src/scripts/geoip'
import { AppAxios } from '@/utils/axios'
import { detectDeviceType, getCPUCoreCount, getGPUArchitecture, getMemoryGB } from '@/utils/shared'
import { BaseAPI } from '../base'

const appFingerprint = useAppStoreFingerprint()

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
      ipHistory: [GeoIPInfo.value.ip],
      geoLocation: {
        type: 'Point',
        coordinates: [GeoIPInfo.value.longitude, GeoIPInfo.value.latitude],
      },
      deviceInfo: {
        // @ts-expect-error https://developer.mozilla.org/zh-CN/docs/Web/API/NetworkInformation/effectiveType
        netType: navigator.connection?.effectiveType,
        platform: navigator.platform,
        isp: GeoIPInfo.value.isp,
      },
      locationInfo: {
        country: GeoIPInfo.value.country,
        city: GeoIPInfo.value.city,
        region: GeoIPInfo.value.region,
      },
    } as AppSystemDevice,
  })
}
