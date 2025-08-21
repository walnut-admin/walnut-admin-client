import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreForceQuitInside = defineStore(StoreKeys.APP_FORCE_QUIT, {
  state: (): IAppStoreForceQuit => ({
    modalShow: useAppStorageSync(AppConstPersistKey.FORCE_QUIT_SHOW, false),
    forceQuitComponent: null,
    quitButton: false,
  }),

  getters: {},

  actions: {
    async onOpenForceQuitModal(quitButton = false) {
      if (!this.forceQuitComponent) {
        const { default: ForceQuitComponent } = await import('@/components/Business/ForceQuit')
        this.forceQuitComponent = markRaw(ForceQuitComponent) as unknown as string
      }
      this.quitButton = quitButton
      this.modalShow = true
    },

    onCloseForceQuitModal() {
      this.modalShow = false
    },
  },
})

const useAppStoreForceQuitOutside = () => useAppStoreForceQuitInside(store)

export function useAppStoreForceQuit() {
  if (getCurrentInstance())
    return useAppStoreForceQuitInside()
  return useAppStoreForceQuitOutside()
}
