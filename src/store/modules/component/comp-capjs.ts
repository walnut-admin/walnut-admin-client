import type { IStoreComp } from '@/store/types'
import { defineStore } from 'pinia'
import { securityCapApiEndpoint } from '@/api/security/cap'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const CAP_WASM_URL = 'https://fastly.jsdelivr.net/npm/@cap.js/wasm@0.0.6/browser/cap_wasm.min.js'

const useStoreCompCapJSInside = defineStore(StoreKeys.COMP_CAPJS, {
  state: (): IStoreComp.CapJS => ({
    elementId: 'walnut-admin-cap',
    loading: false,
    inst: null,
    show: false,
    onSuccess: null,
  }),

  getters: {
    getShow(state) {
      return state.show
    },
    getElementId(state) {
      return state.elementId!
    },
  },

  actions: {
    loadCap(): Promise<ICapInst> {
      if (this.inst)
        return new Promise(resolve => resolve(this.inst!))

      const { httpUrl } = useAppEnvProxy()

      window.CAP_CUSTOM_WASM_URL = CAP_WASM_URL
      return new Promise((resolve) => {
        useScriptTag(`${httpUrl}/static/js/cap/widget@0.1.25.js`, () => {
          this.inst = window.Cap
          resolve(this.inst)
        })
      })
    },

    async refreshCapJSToken() {
      this.loading = true
      try {
        const CapInst = await this.loadCap()
        const cap = new CapInst({
          apiEndpoint: securityCapApiEndpoint,
        }, document.getElementById(this.getElementId)!)
        const { token } = await cap.solve()
        return token
      }
      catch (e) {
        console.error('refresh cap js token failed', e)
        return ''
      }
      finally {
        this.loading = false
      }
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
