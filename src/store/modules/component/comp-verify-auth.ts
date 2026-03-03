import type { VerifyAuthOptions } from '@/components/Global/VerifyAuth/types'
import type { IStoreComp } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useStoreCompVerifyAuthInside = defineStore(StoreKeys.COMP_VERIFY_AUTH, {
  state: (): IStoreComp.VerifyAuth => ({
    show: false,
    options: {},
  }),

  getters: {
    getShow(state) {
      return state.show!
    },
    getOptions(state) {
      return state.options
    },
  },

  actions: {
    onOpenVerifyAuthModal(options?: VerifyAuthOptions) {
      this.options = options
      this.show = true
    },

    onCloseVerifyAuthModal() {
      this.show = false
    },
  },
})

const useStoreCompVerifyAuthOutside = () => useStoreCompVerifyAuthInside(store)

export function useStoreCompVerifyAuth() {
  if (getCurrentInstance())
    return useStoreCompVerifyAuthInside()
  return useStoreCompVerifyAuthOutside()
}
