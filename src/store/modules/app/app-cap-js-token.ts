import { authCapApiEndpoint } from '@/api/app/capjs'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreCapJSTokenInside = defineStore(StoreKeys.APP_CAPJS_TOKEN, {
  state: (): IAppStoreCapJSToken => ({
    capJSInst: null,
    capComponent: null,
    capShow: false,
    onCapSuccess: null,
  }),

  getters: {
    getCapComponent(state) {
      return state.capComponent!
    },
  },

  actions: {
    loadCap(): Promise<ICapInst> {
      if (this.capJSInst)
        return new Promise(resolve => resolve(this.capJSInst!))

      const { httpUrl } = useAppEnvProxy()

      window.CAP_CUSTOM_WASM_URL = 'https://fastly.jsdelivr.net/npm/@cap.js/wasm@0.0.6/browser/cap_wasm.min.js'
      return new Promise((resolve) => {
        useScriptTag(`${httpUrl}/static/js/cap/widget@0.1.25.js`, () => {
          this.capJSInst = window.Cap
          resolve(this.capJSInst)
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
      this.onCapSuccess = onSuccess
      if (!this.capComponent) {
        await this.loadCap()
        const { default: CapComponent } = await import('@/components/Business/Cap')
        this.capComponent = markRaw(CapComponent) as unknown as string
      }
      this.capShow = true
    },

    onCloseCapModal() {
      this.capShow = false
      this.onCapSuccess = null
    },
  },
})

const useAppStoreCapJSTokenOutside = () => useAppStoreCapJSTokenInside(store)

export function useAppStoreCapJSToken() {
  if (getCurrentInstance())
    return useAppStoreCapJSTokenInside()
  return useAppStoreCapJSTokenOutside()
}
