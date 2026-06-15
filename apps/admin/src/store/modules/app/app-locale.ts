import type { OptionDataItem, Recordable } from 'easy-fns-ts'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { getLangListPublicAPI, langAPI } from '@/api/system/lang'
import { getI18nMsgAPI } from '@/api/system/locale'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const preferredLanguages = usePreferredLanguages()
const locale = useAppStorageSync(
  AppConstPersistKey.LOCALE,
  preferredLanguages.value[0].replaceAll('-', '_') as ValueOfAppConstLocale,
)

const useAppStoreLocaleInside = defineStore(StoreKeys.APP_LOCALE, {
  state: (): IStoreApp.Locale => ({
    locale,
    baseI18nKeyList: [],
    langList: [],
  }),

  getters: {
    getLocale(state) {
      return state.locale!
    },
    getLangList(state) {
      return state.langList!
    },
  },

  actions: {
    setLocale(payload: ValueOfAppConstLocale) {
      this.locale = payload
      AppI18n().global.locale.value = payload
      document.querySelector('html')?.setAttribute('lang', payload)
    },

    setBaseI18nKeyList(payload: string[]) {
      this.baseI18nKeyList = payload
    },

    setLangList(payload: OptionDataItem[]) {
      this.langList = payload
    },

    isBaseI18nKey(key: string) {
      return this.baseI18nKeyList?.some(i => i.endsWith(key))
    },

    isLocaleLoaded(locale: ValueOfAppConstLocale): boolean {
      const msg = this.onGetLocaleMessageFromI18n(locale)
      return msg && Object.keys(msg).length > 0
    },

    onGetLocaleMessageFromI18n(locale: ValueOfAppConstLocale) {
      return AppI18n().global.messages.value[locale] as Recordable
    },

    async onGetLangListPublic() {
      if (this.getLangList.length)
        return
      const res = await getLangListPublicAPI()
      this.setLangList(res)
    },

    async onGetLangList() {
      const res = await langAPI.list()
      return res.data.map(i => ({
        label: i.description!,
        value: i._id!,
      }))
    },

    onSetLocaleMessages(locale: ValueOfAppConstLocale, backendMsg: Record<string, string>) {
      AppI18n().global.setLocaleMessage(locale, backendMsg)
      this.setLocale(locale)
      return nextTick()
    },

    async onLoadMessageNoCache(locale: ValueOfAppConstLocale) {
      const backendMsg = await getI18nMsgAPI(locale, 0)
      this.setBaseI18nKeyList(Object.keys(backendMsg).filter(i => i.startsWith('app.base')))
      return this.onSetLocaleMessages(locale, backendMsg)
    },

    async onLoadMessageCache(locale: ValueOfAppConstLocale) {
      if (this.isLocaleLoaded(locale)) {
        return this.onSetLocaleMessages(locale, this.onGetLocaleMessageFromI18n(locale))
      }

      const backendMsg = await getI18nMsgAPI(locale)
      this.setBaseI18nKeyList(Object.keys(backendMsg).filter(i => i.startsWith('app.base')))
      return this.onSetLocaleMessages(locale, backendMsg)
    },
  },
})

const useAppStoreLocaleOutside = () => useAppStoreLocaleInside(store)

export function useAppStoreLocale() {
  if (getCurrentInstance())
    return useAppStoreLocaleInside()
  return useAppStoreLocaleOutside()
}
