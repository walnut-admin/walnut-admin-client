import axios from 'axios'

export const GeoIPInfo = useAppStorage<Partial<ExternalGeoIPInfo>>(AppConstPersistKey.GEO_IP_INFO, {}, { usePresetKey: false, expire: Number.POSITIVE_INFINITY })

export async function setupGeoIP() {
  if (Object.keys(GeoIPInfo.value).length)
    return

  const res = await axios.get<ExternalGeoIPInfo>(EXTERNAL_LINKS.GEOIP)

  if (res.status === 200)
    GeoIPInfo.value = res.data
}
