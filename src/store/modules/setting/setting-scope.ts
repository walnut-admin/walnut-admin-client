import type { IStoreSetting } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreSettingScopeInside = defineStore(StoreKeys.SETTING_SCOPE, {
  state: (): IStoreSetting.Scope => ({}),

  getters: {},

  actions: {},
})

const useAppStoreSettingScopeOutside = () => useAppStoreSettingScopeInside(store)

export function useAppStoreSettingScope() {
  if (getCurrentInstance())
    return useAppStoreSettingScopeInside()
  return useAppStoreSettingScopeOutside()
}
