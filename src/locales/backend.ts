import type { Recordable } from 'easy-fns-ts'
import type { IModels } from '@/api/models'
import { AppAxios } from '@/utils/axios'

/**
 * @description get language lists from back end, used for language change
 * This should only called once in appStoreLocalePicker component
 */
export async function AppI18nGetLangLists() {
  const lists = await AppAxios.get<
    Pick<IModels.SystemLang, 'lang' | 'description' | 'order'>[]
  >({
    url: '/system/lang/list/public',
  })

  return lists.map(i => ({
    value: i.lang!,
    label: i.description!,
  }))
}

/**
 * @description get locale messages from back end by language
 * Called 1: app i18n init
 * Called 2: change language, need to request for new messages by new language
 */
export async function AppI18nGetI18nMsg(lang: string, cache = 1) {
  const messages = await AppAxios.get<Recordable>({
    url: `/system/locale/message/${lang}`,
    params: {
      cache,
    },
  })

  return messages
}
