import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

const appSetting = {
  PUBLIC: 'app/setting/public',
} as const

export const appSettingAPI = new BaseAPI<AppSettingsModel>({
  model: 'app',
  section: 'setting',
})

/**
 * @description get public settings
 */
export function getPublicSettingsAPI() {
  return AppAxios.get<IAppStoreSettingBackend>({
    url: appSetting.PUBLIC,
  })
}
