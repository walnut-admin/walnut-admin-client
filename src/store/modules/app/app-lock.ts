import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { IResponseData } from '@/api/response'
import type { ValueOfAppConstLockMode } from '@/const'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { getLockStatusAPI, lockAPI, unlockAPI } from '@/api/system/user_lock'
import { AppCoreFn1 } from '@/core'
import { AppLockRoute, layoutConst } from '@/router/routes/builtin'
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
    getLockRoute: state => state.lockRoute,
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
     * @description add lock route
     */
    addLockRoute() {
      const { addRoute, hasRoute } = useAppRouter()
      if (hasRoute(layoutConst.lock.name))
        return
      addRoute(AppLockRoute)
    },

    /**
     * @description init lock state
     */
    async onInitLockState() {
      if (!this.getEnable) {
        return
      }

      const res = await getLockStatusAPI()
      this.setLockPreference(res)

      if (res.locked) {
        // NOTICE: DO NOT PUSH ROUTER BELOW
        // ROUTER PUSH SHOULD BE DONE IN INTERCEPTOR
        this.addLockRoute()
      }
    },

    /**
     * @description lock from socket
     */
    async lockFromSocket() {
      if (!this.getEnable) {
        return
      }
      const appStoreFingerprint = useAppStoreFingerprint()

      tryOnMounted(async () => {
        if (!this.getLockCrossDevice)
          return
        const socket = await getSocket()

        socket.on(AppSocketEvents.LOCK, async (payload: { fingerprint: string, userId: string }) => {
          if (payload.fingerprint !== appStoreFingerprint.getFingerprint) {
            this.addLockRoute()
            await useAppRouterPush({ name: layoutConst.lock.name, replace: true })
          }
        })
      })

      tryOnUnmounted(async () => {
        const socket = await getSocket()

        socket.off(AppSocketEvents.LOCK)
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

        this.addLockRoute()
        await useAppRouterPush({ name: layoutConst.lock.name, replace: true })
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
      if (!this.getEnable) {
        return
      }

      const appStoreFingerprint = useAppStoreFingerprint()

      tryOnMounted(async () => {
        if (!this.getLockCrossDevice)
          return

        const socket = await getSocket()
        socket.on(AppSocketEvents.UNLOCK, (payload: { fingerprint: string, userId: string }) => {
          if (payload.fingerprint !== appStoreFingerprint.getFingerprint) {
            this.logicAfterUnlock()
          }
        })
      })

      tryOnUnmounted(async () => {
        const socket = await getSocket()

        socket.off(AppSocketEvents.UNLOCK)
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
