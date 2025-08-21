import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { clone, isEmpty } from 'lodash-es'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreLockInside = defineStore(StoreKeys.APP_LOCK, {
  state: (): IAppStoreLock => ({
    isLock: useAppStorageSync(AppConstPersistKey.IS_LOCK, false),
    lockRoute: useAppStorageSync(AppConstPersistKey.LOCK_ROUTE, {}),
  }),

  getters: {},

  actions: {
    setIsLock(payload: boolean) {
      this.isLock = payload
    },

    setLockRoute(payload: AppLockRoute) {
      this.lockRoute = payload
    },

    async lock(route: Ref<RouteLocationNormalizedLoaded>) {
      const appSetting = useAppStoreSetting()

      if (!appSetting.getLockStatus)
        return

      this.setIsLock(true)

      this.setLockRoute({
        name: route.value.name as string,
        query: route.value.query,
        params: route.value.params,
      })

      await useAppRouterPush({ name: AppLockName })
    },

    async unLock() {
      const appSetting = useAppStoreSetting()

      if (!appSetting.getLockStatus)
        return

      const appMenu = useAppStoreMenu()

      this.setIsLock(false)

      const lockRoute = clone(this.lockRoute)
      this.setLockRoute({})

      if (isEmpty(lockRoute))
        await appMenu.goIndex()
      else
        await useAppRouterPush(lockRoute)
    },
  },
})

const useAppStoreLockOutside = () => useAppStoreLockInside(store)

export function useAppStoreLock() {
  if (getCurrentInstance())
    return useAppStoreLockInside()
  return useAppStoreLockOutside()
}
