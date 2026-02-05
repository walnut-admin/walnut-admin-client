import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { IResponseData } from '@/api/response'
import type { ValueOfAppConstLockMode } from '@/const'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { getLockStatusAPI, lockAPI, unlockAPI } from '@/api/system/user_lock'
import { AppCoreFn1 } from '@/core'
import { mainoutConst, mainoutLockRoute } from '@/router/routes/mainout'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreLockInside = defineStore(StoreKeys.APP_LOCK, {
  state: (): IStoreApp.Lock => ({
    enable: true,
    loading: false,
    locked: false,
    lockRoute: {},
    lockCrossDevice: false,
    lockMode: 'default',
    lockIdleSec: 0,
    lockSecuritySec: 0,
  }),

  getters: {
    getEnable: state => state.enable,
    getLoading: state => state.loading,
    getLockCrossDevice: state => state.lockCrossDevice,
    getLocked: state => state.locked,
    getLockRoute: (state) => {
      if (!state.lockRoute) {
        const appStoreMenu = useAppStoreMenu()

        return { name: appStoreMenu.getIndexMenuName }
      }
      return state.lockRoute
    },
    getLockMode: state => state.lockMode,
    getLockIdleSec: state => state.lockIdleSec,
    getLockSecuritySec: state => state.lockSecuritySec,
  },

  actions: {
    setLockPreference(payload: IResponseData.System.User.LockStatus) {
      this.setLocked(payload.locked)
      this.setLockCrossDevice(payload.lockCrossDevice)
      this.setLockRoute(payload.lockRoute)
      this.setLockMode(payload.lockMode)
      this.setLockIdleSec(payload.lockIdleSec)
      this.setLockSecuritySec(payload.lockSecuritySec)
    },

    setLocked(payload: boolean) {
      this.locked = payload
    },

    setLockCrossDevice(payload: boolean) {
      this.lockCrossDevice = payload
    },

    setLockRoute(payload: IStoreApp.LockRoute) {
      this.lockRoute = payload
    },

    setLockMode(payload: ValueOfAppConstLockMode) {
      this.lockMode = payload
    },

    setLockIdleSec(payload: number) {
      this.lockIdleSec = payload
    },

    setLockSecuritySec(payload: number) {
      this.lockSecuritySec = payload
    },

    /**
     * @description init lock state
     */
    async onInitLockState() {
      const res = await getLockStatusAPI()
      this.setLockPreference(res)

      if (res.locked) {
        await this.logicAfterLock()
      }
    },

    /**
     * @description lock from socket
     */
    async lockFromSocket() {
      if (!this.getEnable) {
        return
      }

      registerSocketEvent(AppSocketEvents.LOCK, async () => {
        await this.logicAfterLock()
      })
    },

    /**
     * @description lock
     */
    async lock(route: Ref<RouteLocationNormalizedLoaded>) {
      if (!this.getEnable) {
        return
      }

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
     * @description logic after lock
     */
    async logicAfterLock(push = true) {
      const appStoreRoute = useAppStoreRoute()
      appStoreRoute.addDynamicAuthRoute(mainoutLockRoute)
      if (push)
        await useAppRouterPush({ name: mainoutConst.lock.name, replace: true })
    },

    /**
     * @description logic after unlock
     */
    async logicAfterUnlock() {
      const userStoreProfile = useAppStoreUserProfile()
      await userStoreProfile.getProfile()
      await AppCoreFn1()
      await useAppRouterPush(this.getLockRoute)

      // const appStoreRoute = useAppStoreRoute()
      // appStoreRoute.removeDynamicAuthRoute(mainoutLockRoute)
    },

    /**
     * @description unlock from socket
     */
    async unlockFromSocket() {
      if (!this.getEnable) {
        return
      }
      registerSocketEvent(AppSocketEvents.UNLOCK, () => {
        this.logicAfterUnlock()
      })
    },

    /**
     * @description unlock
     */
    async unLock() {
      if (!this.getEnable) {
        return
      }

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
