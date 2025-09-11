import type { Recordable } from 'easy-fns-ts'
import type { IModels } from '../models'
import type { ValueOfAppConstLocale } from '@/const'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const localeAPI = new BaseAPI<IModels.SystemLocale>({
  model: 'system',
  section: 'locale',
})

/**
 * @description get locale messages from back end by language
 * Called 1: app i18n init
 * Called 2: change language, need to request for new messages by new language
 */
export async function AppI18nGetI18nMsg(lang: ValueOfAppConstLocale, cache = 1) {
  const messages = await AppAxios.get<Recordable>({
    url: `/system/locale/message/${lang}`,
    params: {
      cache,
    },
  })

  return messages
}
