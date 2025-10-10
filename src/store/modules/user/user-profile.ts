import type { IModels } from '@/api/models'
import type { IStoreUser } from '@/store/types'
import { upperFirst } from 'easy-fns-ts'
import { defineStore } from 'pinia'
import { getUserProfileAPI } from '@/api/auth'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreUserProfileInside = defineStore(StoreKeys.USER_PROFILE, {
  state: (): IStoreUser.Profile => ({
    profile: {},
  }),

  getters: {
    getUserId(state) {
      return state.profile._id
    },

    getDisplayName(): string {
      if (this.profile.nickName)
        return upperFirst(this.profile.nickName)
      if (this.profile.userName)
        return upperFirst(this.profile.userName)
      return ''
    },

    getNameFirstLetter(): string {
      return this.getDisplayName.charAt(0)
    },

    getAvatar(): string {
      return this.profile.avatar!
    },

    getRoleList(state) {
      return state.profile.populated_rolesList
    },

    getCurrentRole(state) {
      return state.profile.currentRole
    },

    getCurrentRoleModeIsSwitchable(state) {
      return state.profile.roleMode === 'switchable'
    },
  },

  actions: {
    setProfile(payload: Partial<IModels.SystemUser>) {
      this.profile = payload
    },

    async getProfile() {
      const { user, preference, lockPreference } = await getUserProfileAPI()
      this.setProfile(user)

      // set locked preference
      const appStoreLock = useAppStoreLock()
      appStoreLock.setLockPreference(lockPreference)

      // set user preference
      const appStorePreference = useAppStoreUserPreference()
      appStorePreference.setPreference(preference)

      // get private settings
      const appSettingScope = useAppStoreSettingScope()
      await appSettingScope.onInitPrivateSettings()

      // setup socket
      setupSocket()
    },

    setAvatar(newAvatar: string) {
      this.setProfile(Object.assign(this.profile, { avatar: newAvatar }))
    },
  },
})

const useAppStoreUserProfileOutside = () => useAppStoreUserProfileInside(store)

export function useAppStoreUserProfile() {
  if (getCurrentInstance())
    return useAppStoreUserProfileInside()
  return useAppStoreUserProfileOutside()
}
