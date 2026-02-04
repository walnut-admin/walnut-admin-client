import type { IRequestPayload } from '@/api/request'
import type { IStoreUser } from '@/store/types'
import * as opaque from '@serenity-kit/opaque'
import { defineStore } from 'pinia'

import { refreshTokenAPI, signoutAPI } from '@/api/auth'
import { authWithEmailAPI } from '@/api/auth/email'
import { authWithGoogleAPI } from '@/api/auth/google'
import { opaqueChangePasswordFinishAPI, opaqueChangePasswordStartAPI, opaqueLoginFinishAPI, opaqueLoginStartAPI } from '@/api/auth/opaque'
import { authWithPhoneNumberAPI } from '@/api/auth/phone'
import { updatePasswordFinishAPI, updatePasswordStartAPI } from '@/api/system/user'
import { AppCoreFn1 } from '@/core'
import { AppRootRoute } from '@/router/routes/builtin'
import { mainoutConst } from '@/router/routes/mainout'
import { enhancedAesGcmLocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageAsync } from '@/utils/persistent/storage/async'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

// JUST DO NOT CHANGE THIS
const opaqueServerIdentifier = 'walnut-admin'

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
    loading: false,
    accessToken: accessTokenStorage,
    remember: rememberStorage,
  }),

  getters: {
    getLoading(state) {
      return state.loading
    },
    getAccessToken(state) {
      return state.accessToken
    },
    getRemember(state) {
      return state.remember
    },
  },

  actions: {
    setLoading(payload: boolean) {
      this.loading = payload
    },
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

      // when refresh AT, also refresh session key sliding storage
      const appStoreSecurity = useAppStoreSecurity()
      appStoreSecurity.touchSessionKey()

      return accessToken
    },

    /**
     * @description refresh AT and permission after switch role
     */
    async ExecuteAfterSwitchRole() {
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
    async ExecuteCoreFnAfterAuth(at: string, sessionKey?: string) {
      const appStoreSecurity = useAppStoreSecurity()
      const userStoreProfile = useAppStoreUserProfile()
      const appStoreMenu = useAppStoreMenu()

      // set session key
      if (sessionKey) {
        appStoreSecurity.setSessionKey(sessionKey)
      }

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
     * @description email way to auth
     */
    async AuthWithEmailAddress(payload: IRequestPayload.Auth.Email.Verify) {
      const res = await authWithEmailAPI(payload)

      // execute core fn
      await this.ExecuteCoreFnAfterAuth(res.accessToken, res.sessionKey)
    },

    /**
     * @description text message way to auth
     */
    async AuthWithPhoneNumber(payload: IRequestPayload.Auth.Phone.Verify) {
      const res = await authWithPhoneNumberAPI(payload)

      // execute core fn
      await this.ExecuteCoreFnAfterAuth(res.accessToken, res.sessionKey)
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
      await this.ExecuteCoreFnAfterAuth(res.accessToken, res.sessionKey)
    },

    /**
     * @description opaque way to auth
     */
    async AuthWithOpaque(payload: IRequestPayload.Auth.Password) {
      const { userName, password } = payload

      try {
        // ==================== 步骤 1: 客户端开始登录 ====================
        const { clientLoginState, startLoginRequest } = opaque.client.startLogin({
          password,
        })

        // ==================== 步骤 2: 发送登录请求到服务器 ====================
        const loginResponse = await opaqueLoginStartAPI({
          userName,
          loginRequest: startLoginRequest,
        })

        // ==================== 步骤 3: 客户端完成登录 ====================
        const loginResult = opaque.client.finishLogin({
          clientLoginState,
          loginResponse,
          password,
          identifiers: {
            client: userName,
            server: opaqueServerIdentifier,
          },
        })

        // this normally means password error
        if (!loginResult) {
          useAppMsgError(AppI18n().global.t('app.base.failure'))
          return
        }

        // export key can be used on end-to-end encryption
        const { finishLoginRequest, exportKey: _exportKey, serverStaticPublicKey } = loginResult

        // server static public key check
        if (serverStaticPublicKey !== import.meta.env.VITE_SERVER_STATIC_PUBLIC_KEY) {
          useAppMsgError(AppI18n().global.t('app.base.failure'))
          return
        }

        // ==================== 步骤 4: 发送最终登录确认到服务器 ====================
        const res = await opaqueLoginFinishAPI({
          userName,
          loginFinish: finishLoginRequest,
        })

        // remember me
        if (payload.rememberMe)
          this.setRemember({ userName, password })
        else
          this.setRemember(undefined)

        // execute core fn
        await this.ExecuteCoreFnAfterAuth(res.accessToken, res.sessionKey)
      }
      catch (error: any) {
        console.error('Login failed:', error)
      }
    },

    async opaqueRegisterCore(
      userName: string,
      newPassword: string,
      startApi: ({ userName, registrationRequest }: { userName: string, registrationRequest: string }) => Promise<string>,
      finishApi: ({ userName, registrationRecord }: { userName: string, registrationRecord: string }) => Promise<boolean>,
    ) {
      try {
        // ==================== 步骤 1: 开始注册流程 ====================
        const { clientRegistrationState, registrationRequest } = opaque.client.startRegistration({
          password: newPassword,
        })

        // ==================== 步骤 2: 发送注册请求到服务器 ====================
        const registrationResponse = await startApi({ userName, registrationRequest })

        // ==================== 步骤 3: 完成注册，生成新的注册记录 ====================
        const { registrationRecord, serverStaticPublicKey } = opaque.client.finishRegistration({
          clientRegistrationState,
          registrationResponse,
          password: newPassword,
          identifiers: {
            client: userName,
            server: opaqueServerIdentifier,
          },
        })

        // server static public key check
        if (serverStaticPublicKey !== import.meta.env.VITE_SERVER_STATIC_PUBLIC_KEY) {
          useAppMsgError(AppI18n().global.t('app.base.failure'))
          return
        }

        // ==================== 步骤 4: 提交新的注册记录 ====================
        await finishApi({ userName, registrationRecord })
      }
      catch (error: any) {
        console.error(error)
        throw new Error(error.response?.data?.message)
      }
    },

    /**
     * @description opaque way to change password for user
     */
    async changePasswordWithOpaque(newPassword: string) {
      const userStoreProfile = useAppStoreUserProfile()

      const userName = userStoreProfile.profile.userName!

      // password change also means re-register in opaque auth system
      await this.opaqueRegisterCore(
        userName,
        newPassword,
        ({ registrationRequest }) => opaqueChangePasswordStartAPI({ registrationRequest }),
        ({ registrationRecord }) => opaqueChangePasswordFinishAPI({ registrationRecord }),
      )
    },

    /**
     * @description opaque way to update password for admin
     */
    async updatePasswordWithOpaqueForAdmin({ userId, userName, newPassword }: { userId: string, userName: string, newPassword: string }) {
      // password change also means re-register in opaque auth system
      await this.opaqueRegisterCore(
        userName,
        newPassword,
        ({ registrationRequest }) => updatePasswordStartAPI({ _id: userId, registrationRequest }),
        ({ registrationRecord }) => updatePasswordFinishAPI({ _id: userId, registrationRecord }),
      )
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
      const userStorePreference = useAppStoreUserPreference()
      const appStoreSecurity = useAppStoreSecurity()

      // call signout to remove refresh_token
      if (callApi) {
        await signoutAPI()
      }

      // clear tokens
      this.clearTokens()

      // clear session key
      appStoreSecurity.clearSessionKey()

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

      // clear preference
      userStorePreference.$reset()

      // clear lock
      appStoreLock.$reset()

      // disconnect socket
      destroySocket()

      // send beacon
      sendUserMonitorBeacon({ userId: null, auth: false })

      const id = setTimeout(async () => {
        // push to signin page
        await useAppRouterPush({ name: mainoutConst.auth.name, replace: true, force: true })
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
