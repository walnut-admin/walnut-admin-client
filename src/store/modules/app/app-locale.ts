import { useAppStorage } from '@/utils/persistent/Storage'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const preferredLanguages = usePreferredLanguages()

const useAppStoreLocaleInside = defineStore(StoreKeys.APP_LOCALE, {
  state: (): IAppStoreLocale => ({
    locale: useAppStorage(
      AppConstPersistKey.LOCALE,
      preferredLanguages.value[0].replaceAll('-', '_') as ValueOfAppConstLocale,
      { expire: Infinity, encrypt: false, usePresetKey: false },
    ),
  }),

  getters: {},

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
