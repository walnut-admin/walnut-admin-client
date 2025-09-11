import type { IStoreComp } from '@/store/types'
import { defineStore } from 'pinia'
import { authCapApiEndpoint } from '@/api/app/capjs'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useStoreCompCapJSInside = defineStore(StoreKeys.COMP_CAPJS, {
  state: (): IStoreComp.CapJS => ({
    inst: null,
    show: false,
    onSuccess: null,
  }),

  getters: {
    getShow(state) {
      return state.show
    },
  },

  actions: {
    loadCap(): Promise<ICapInst> {
      if (this.inst)
        return new Promise(resolve => resolve(this.inst!))

      const { httpUrl } = useAppEnvProxy()

      window.CAP_CUSTOM_WASM_URL = 'https://fastly.jsdelivr.net/npm/@cap.js/wasm@0.0.6/browser/cap_wasm.min.js'
      return new Promise((resolve) => {
        useScriptTag(`${httpUrl}/static/js/cap/widget@0.1.25.js`, () => {
          this.inst = window.Cap
          resolve(this.inst)
        })
      })
    },

    async refreshCapJSToken() {
      const CapInst = await this.loadCap()

      const cap = new CapInst({
        apiEndpoint: authCapApiEndpoint,
      }, document.getElementById('walnut-admin-cap')!)
      const { token } = await cap.solve()

      return token
    },

    async onOpenCapModal(onSuccess: (token: string) => void) {
      this.onSuccess = onSuccess
      await this.loadCap()
      this.show = true
    },

    onCloseCapModal() {
      this.show = false
      this.onSuccess = null
    },
  },
})

const useStoreCompCapJSOutside = () => useStoreCompCapJSInside(store)

export function useStoreCompCapJS() {
  if (getCurrentInstance())
    return useStoreCompCapJSInside()
  return useStoreCompCapJSOutside()
}
