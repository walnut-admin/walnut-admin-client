import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import { AppPersistEncryption } from '@/utils/crypto'
import { watob, wbtoa } from '@/utils/window/base64'
import qs from 'qs'

export function stringifyQuery(obj: LocationQueryRaw) {
  const appSetting = useAppStoreSetting()

  if (!obj || Object.keys(obj).length === 0)
    return ''

  const str = qs.stringify(obj)

  if (appSetting.app.routeQueryMode === AppConstRouteQueryMode.ENHANCED) {
    if (appSetting.app.routeQueryEnhancedMode === AppConstRouteQueryEnhancedMode.BASE64)
      return wbtoa(str)

    if (appSetting.app.routeQueryEnhancedMode === AppConstRouteQueryEnhancedMode.CRYPTOJS)
      return AppPersistEncryption.encrypt(str)!
  }

  return str
}

const whiteList = [AppOpenExternalPath]

export function parseQuery(query: string) {
  const appSetting = useAppStoreSetting()

  const str = qs.parse(query) as LocationQuery

  if (whiteList.includes(window.location.pathname))
    return str

  if (appSetting.app.routeQueryMode === AppConstRouteQueryMode.ENHANCED) {
    if (appSetting.app.routeQueryEnhancedMode === AppConstRouteQueryEnhancedMode.BASE64)
      return qs.parse(watob(query)) as LocationQuery

    if (appSetting.app.routeQueryEnhancedMode === AppConstRouteQueryEnhancedMode.CRYPTOJS)
      return qs.parse(AppPersistEncryption.decrypt(query)) as LocationQuery
  }

  return str
}
