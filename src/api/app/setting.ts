import type { IModels } from '../models'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

const appSetting = {
  PUBLIC: '/app/setting/public',
} as const

export const appSettingAPI = new BaseAPI<IModels.AppSettings>({
  model: 'app',
  section: 'setting',
})

/**
 * @description get public settings
 */
export function getPublicSettingsAPI() {
  return AppAxios.get<IResponseData.App.Setting>({
    url: appSetting.PUBLIC,
  })
}
