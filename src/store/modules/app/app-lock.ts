import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { lockAPI, unlockAPI } from '@/api/system/user_lock'
import { AppCoreFn1 } from '@/core'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreLockInside = defineStore(StoreKeys.APP_LOCK, {
  state: (): IStoreApp.Lock => ({
    loading: false,
    locked: false,
    lockRoute: {},
  }),

  getters: {
    getLoading: state => state.loading,
    getLocked: state => state.locked,
    getLockRoute: state => state.lockRoute,
  },

  actions: {
    setLocked(payload: boolean) {
      this.locked = payload
    },

    setLockRoute(payload: IStoreApp.LockRoute) {
      this.lockRoute = payload
    },

    /**
     * @description logic after lock
     */
    async logicAfterLock() {
      await useAppRouterPush({ name: AppLockName })
    },

    /**
     * @description lock from socket
     */
    async lockFromSocket() {
      const appStoreFingerprint = useAppStoreFingerprint()

      tryOnMounted(() => {
        getSocket()?.on(AppSocketEvents.LOCK, (payload: { fingerprint: string, userId: string }) => {
          if (payload.fingerprint !== appStoreFingerprint.getFingerprint) {
            this.logicAfterLock()
          }
        })
      })

      tryOnUnmounted(() => {
        getSocket()?.off(AppSocketEvents.LOCK)
      })
    },

    /**
     * @description lock
     */
    async lock(route: Ref<RouteLocationNormalizedLoaded>) {
      const appSetting = useAppStoreSetting()

      if (!appSetting.getLockStatus)
        return

      this.loading = true

      try {
        await lockAPI({
          name: route.value.name as string,
          query: route.value.query,
          params: route.value.params,
        })

        await this.logicAfterLock()
      }
      finally {
        this.loading = false
      }
    },

    /**
     * @description logic after unlock
     */
    async logicAfterUnlock() {
      const userStoreProfile = useAppStoreUserProfile()
      await userStoreProfile.getProfile()
      await AppCoreFn1()
      await useAppRouterPush(this.getLockRoute)
    },

    /**
     * @description unlock from socket
     */
    async unlockFromSocket() {
      const appStoreFingerprint = useAppStoreFingerprint()

      tryOnMounted(() => {
        getSocket()?.on(AppSocketEvents.UNLOCK, (payload: { fingerprint: string, userId: string }) => {
          if (payload.fingerprint !== appStoreFingerprint.getFingerprint) {
            this.logicAfterUnlock()
          }
        })
      })

      tryOnUnmounted(() => {
        getSocket()?.off(AppSocketEvents.UNLOCK)
      })
    },

    /**
     * @description unlock
     */
    async unLock() {
      const appSetting = useAppStoreSetting()

      if (!appSetting.getLockStatus)
        return

      this.loading = true

      try {
        await unlockAPI()
        await this.logicAfterUnlock()
      }
      catch (error) {
        console.error('unLock error', error)
        const appStoreMenu = useAppStoreMenu()
        await appStoreMenu.goIndex()
      }
      finally {
        this.loading = false
      }
    },
  },
})

const useAppStoreLockOutside = () => useAppStoreLockInside(store)

export function useAppStoreLock() {
  if (getCurrentInstance())
    return useAppStoreLockInside()
  return useAppStoreLockOutside()
}
