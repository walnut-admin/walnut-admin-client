import type { IStoreUser } from '@/store/types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreUserPermissionInside = defineStore(StoreKeys.USER_PERMISSION, {
  state: (): IStoreUser.Permission => ({
    permissions: [],
  }),

  getters: {},

  actions: {
    setPermissions(payload: string[]) {
      this.permissions = payload
    },

    deletePermission(payload?: string) {
      if (!payload)
        return true

      const index = this.permissions.findIndex(i => i === payload)
      this.permissions.splice(index, 1)
    },

    togglePermission(payload?: string) {
      if (!payload)
        return true

      if (this.hasPermission(payload))
        this.deletePermission(payload)
      else
        this.permissions.push(payload)
    },

    hasPermission(payload: string) {
      if (!payload)
        return false

      return this.permissions.includes(payload)
    },
  },
})

function useAppStoreUserPermissionOutside() {
  return useAppStoreUserPermissionInside(store)
}

export function useAppStoreUserPermission() {
  if (getCurrentInstance())
    return useAppStoreUserPermissionInside()
  return useAppStoreUserPermissionOutside()
}
