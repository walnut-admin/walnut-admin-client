import type { IModels } from '../models'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const langAPI = new BaseAPI<IModels.SystemLang>({
  model: 'system',
  section: 'lang',
})

/**
 * @description get language lists from back end, used for language change
 * This should only called once in appStoreLocalePicker component
 */
export async function AppI18nGetLangLists() {
  const lists = await AppAxios.get<IResponseData.System.Lang.Public>({
    url: '/system/lang/list/public',
  })

  return lists.map(i => ({
    value: i.lang!,
    label: i.description!,
  }))
}
