import type { NotificationPlacement, NotificationReactive } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreNaiveInside = defineStore(StoreKeys.APP_MSG, {
  state: (): IStoreApp.Naive => ({
    notiMax: 5,
    msgMax: 5,
    notiPlacement: 'top-right',
    msgPlacement: 'top',
    notiContainerStyle: {},
    currentNotiInst: null,
    currentMsgInst: null,
  }),

  getters: {
    getNotiMax: state => state.notiMax,
    getMsgMax: state => state.msgMax,

    getNotiPlacement: state => state.notiPlacement,
    getMsgPlacement: state => state.msgPlacement,

    getNotiContainerStyle: state => state.notiContainerStyle,
    getCurrentNotiInst: state => state.currentNotiInst,
    getCurrentMsgInst: state => state.currentMsgInst,
  },

  actions: {
    /**
     * notificaiton
     */
    setNotiPlacement(payload: NotificationPlacement) {
      this.notiPlacement = payload
    },

    setNotiContainerStyle(payload: CSSProperties) {
      this.notiContainerStyle = payload
    },

    setCurrentNotiInst(payload: NotificationReactive | null) {
      this.currentNotiInst = payload
    },

    destroyCurrentNotiInst() {
      return new Promise((resolve) => {
        this.currentNotiInst?.destroy()
        this.setCurrentNotiInst(null)
        resolve(true)
      })
    },

    destroyAllNotiInst() {
      useAppNotification().destroyAll()
    },

    /**
     * message
     */
    setMsgPlacement(payload: NotificationPlacement) {
      this.msgPlacement = payload
    },
  },
})

const useAppStoreNaiveOutside = () => useAppStoreNaiveInside(store)

export function useAppStoreNaive() {
  if (getCurrentInstance())
    return useAppStoreNaiveInside()
  return useAppStoreNaiveOutside()
}
