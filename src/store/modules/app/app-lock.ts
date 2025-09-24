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

        await useAppRouterPush({ name: AppLockName })
      }
      finally {
        this.loading = false
      }
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

        const userStoreProfile = useAppStoreUserProfile()
        await userStoreProfile.getProfile()
        await AppCoreFn1()

        await useAppRouterPush(this.getLockRoute)
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
