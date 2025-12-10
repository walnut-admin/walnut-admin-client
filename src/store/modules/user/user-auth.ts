import type { IRequestPayload } from '@/api/request'
import type { IStoreUser } from '@/store/types'
import { defineStore } from 'pinia'
import { authWithPwdAPI, refreshTokenAPI, signoutAPI } from '@/api/auth'
import { authWithEmailAPI } from '@/api/auth/email'
import { authWithGoogleAPI } from '@/api/auth/google'
import { authWithPhoneNumberAPI } from '@/api/auth/phone'
import { AppCoreFn1 } from '@/core'
import { AppRootRoute } from '@/router/routes/builtin'
import { enhancedAesGcmLocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageAsync } from '@/utils/persistent/storage/async'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

// eslint-disable-next-line antfu/no-top-level-await
const accessTokenStorage = await useAppStorageAsync(AppConstPersistKey.ACCESS_TOKEN, '', { storage: enhancedAesGcmLocalStorage(true) })
// eslint-disable-next-line antfu/no-top-level-await
const rememberStorage = await useAppStorageAsync(AppConstPersistKey.REMEMBER, {
  userName: '',
  password: '',
}, {
  storage: enhancedAesGcmLocalStorage(true),
})

const useAppStoreUserAuthInside = defineStore(StoreKeys.USER_AUTH, {
  state: (): IStoreUser.Auth => ({
    accessToken: accessTokenStorage,
    remember: rememberStorage,
  }),

  getters: {},

  actions: {
    setAccessToken(payload: string) {
      this.accessToken = payload
    },
    setRemember(payload: IRequestPayload.Auth.Password | undefined) {
      this.remember = payload
    },

    clearTokens() {
      this.setAccessToken('')
    },

    /**
     * @description get new access token use refresh token
     */
    async GetNewATWithRT(): Promise<string> {
      const { accessToken } = await refreshTokenAPI()

      this.setAccessToken(accessToken)

      return accessToken
    },

    /**
     * @description refresh AT and permission after switch role
     */
    async ExcuteAfterSwitchRole() {
      // destroy socket
      destroySocket()

      const accessToken = await this.GetNewATWithRT()

      // remove root route will remove all it's children
      AppRouter.removeRoute(AppRootRoute.name!)
      AppRouter.addRoute(AppRootRoute)

      await this.ExecuteCoreFnAfterAuth(accessToken)
    },

    /**
     * @description core function after signin to execute
     */
    async ExecuteCoreFnAfterAuth(at: string) {
      const userStoreProfile = useAppStoreUserProfile()
      const appStoreMenu = useAppStoreMenu()

      // set tokens
      this.setAccessToken(at)

      // get user profile
      await userStoreProfile.getProfile()

      // get menus/permissions/keys etc
      await AppCoreFn1()

      // send beacon
      sendUserMonitorBeacon({ userId: userStoreProfile.profile._id, auth: true })

      // push to the index menu
      await appStoreMenu.goIndex()
    },

    /**
     * @description password way to auth
     */
    async AuthWithBasicPassword(payload: IRequestPayload.Auth.Password) {
      const res = await authWithPwdAPI({
        userName: payload.userName,
        password: payload.password,
      })

      // execute core fn
      await this.ExecuteCoreFnAfterAuth(res.accessToken)

      const { userName, password, rememberMe } = payload

      // remember me
      if (rememberMe)
        this.setRemember({ userName, password })
      else
        this.setRemember(undefined)
    },

    /**
     * @description email way to auth
     */
    async AuthWithEmailAddress(payload: IRequestPayload.Auth.Email.Verify) {
      const res = await authWithEmailAPI(payload)

      // execute core fn
      await this.ExecuteCoreFnAfterAuth(res.accessToken)
    },

    /**
     * @description text message way to auth
     */
    async AuthWithPhoneNumber(payload: IRequestPayload.Auth.Phone.Verify) {
      const res = await authWithPhoneNumberAPI(payload)

      // execute core fn
      await this.ExecuteCoreFnAfterAuth(res.accessToken)
    },

    /**
     * @description google way to auth
     */
    async AuthWithGoogleFedCM(payload: IRequestPayload.Auth.Google) {
      const res = await authWithGoogleAPI({
        credential: payload.credential,
        select_by: payload.select_by,
      })

      // execute core fn
      await this.ExecuteCoreFnAfterAuth(res.accessToken)
    },

    /**
     * @description signout, need to clean lots of state
     */
    async Signout(callApi = true) {
      const userStoreProfile = useAppStoreUserProfile()
      const userStorePermission = useAppStoreUserPermission()
      const appStoreMenu = useAppStoreMenu()
      const appStoreTab = useAppStoreTab()
      const compStoreCapJS = useStoreCompCapJS()
      const appStoreCachedViews = useAppStoreCachedViews()
      const appStoreLock = useAppStoreLock()

      // call signout to remove refresh_token
      if (callApi) {
        await signoutAPI()
      }

      // clear tokens
      this.clearTokens()

      // clear capjs token
      compStoreCapJS.$reset()

      // clear user profile
      userStoreProfile.$reset()

      // clear menus
      appStoreMenu.$reset()

      // clear permissions
      userStorePermission.$reset()

      // clear tab
      appStoreTab.$reset()

      // clear cached views
      appStoreCachedViews.$reset()

      // clear lock
      appStoreLock.$reset()

      // disconnect socket
      destroySocket()

      // send beacon
      sendUserMonitorBeacon({ userId: null, auth: false })

      const id = setTimeout(async () => {
        // push to signin page
        await useAppRouterPush({ name: AppAuthName, replace: true, force: true })
        clearTimeout(id)
      }, 200)
    },
  },
})

const useAppStoreUserAuthOutside = () => useAppStoreUserAuthInside(store)

export function useAppStoreUserAuth() {
  if (getCurrentInstance())
    return useAppStoreUserAuthInside()
  return useAppStoreUserAuthOutside()
}
