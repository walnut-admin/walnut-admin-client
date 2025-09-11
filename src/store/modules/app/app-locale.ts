import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const preferredLanguages = usePreferredLanguages()

const useAppStoreLocaleInside = defineStore(StoreKeys.APP_LOCALE, {
  state: (): IStoreApp.Locale => ({
    locale: useAppStorageSync(
      AppConstPersistKey.LOCALE,
      preferredLanguages.value[0].replaceAll('-', '_') as ValueOfAppConstLocale,
    ),
  }),

  getters: {
    getLocale(state) {
      return state.locale!
    },
  },

  actions: {
    setLocale(payload: ValueOfAppConstLocale) {
      this.locale = payload
    },
  },
})

const useAppStoreLocaleOutside = () => useAppStoreLocaleInside(store)

export function useAppStoreLocale() {
  if (getCurrentInstance())
    return useAppStoreLocaleInside()
  return useAppStoreLocaleOutside()
}
