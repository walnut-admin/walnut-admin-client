import type { IStoreComp } from '@/store/types'
import { defineStore } from 'pinia'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

// NOTICE need to declear first then assign to store
const show = useAppStorageSync(AppConstPersistKey.FORCE_QUIT_SHOW, false)

const useStoreCompForceQuitInside = defineStore(StoreKeys.COMP_FORCE_QUIT, {
  state: (): IStoreComp.ForceQuit => ({
    show,
    quitButton: false,
  }),

  getters: {
    getShow(state) {
      return state.show!
    },
    getShowQuitButton(state) {
      return state.quitButton
    },
  },

  actions: {
    onOpenForceQuitModal(quitButton = false) {
      this.quitButton = quitButton
      this.show = true
    },

    onCloseForceQuitModal() {
      this.show = false
    },
  },
})

const useStoreCompForceQuitOutside = () => useStoreCompForceQuitInside(store)

export function useStoreCompForceQuit() {
  if (getCurrentInstance())
    return useStoreCompForceQuitInside()
  return useStoreCompForceQuitOutside()
}
