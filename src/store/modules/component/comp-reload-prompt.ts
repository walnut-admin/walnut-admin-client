import type { IStoreComp } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useStoreCompReloadPromptInside = defineStore(StoreKeys.COMP_RELOAD_PROMPT, {
  state: (): IStoreComp.ReloadPrompt => ({
    needRefresh: false,
    offlineReady: false,
    reloadFn: () => {},
  }),

  getters: {
    getShow(state) {
      return state.needRefresh || state.offlineReady
    },
  },

  actions: {
    setOptions(needRefresh: boolean, offlineReady: boolean, reload: () => void) {
      this.needRefresh = needRefresh
      this.offlineReady = offlineReady
      this.reloadFn = reload
    },

    closePrompt() {
      this.needRefresh = false
      this.offlineReady = false
    },
  },
})

const useStoreCompReloadPromptOutside = () => useStoreCompReloadPromptInside(store)

export function useStoreCompReloadPrompt() {
  if (getCurrentInstance())
    return useStoreCompReloadPromptInside()
  return useStoreCompReloadPromptOutside()
}
