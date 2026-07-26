import { useRegisterSW } from 'virtual:pwa-register/vue'

export function installPWARegister() {
  const intervalMS = 60 * 60 * 1000

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      r && setInterval(() => r.update(), intervalMS)
    },
  })

  watch([offlineReady, needRefresh], ([ready, refresh]) => {
    const compStoreReloadPrompt = useStoreCompReloadPrompt()
    compStoreReloadPrompt.setOptions(refresh, ready, updateServiceWorker)
  })
}
