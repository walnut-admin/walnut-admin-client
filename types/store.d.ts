import type { RemovableRef } from '@vueuse/core'
import type { Nullable, Recordable, TreeNodeItem } from 'easy-fns-ts'
import type {
  MessageReactive,
  NotificationReactive,
} from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { RouteRecordNameGeneric } from 'vue-router'
import type {
  AppSettingsForApp,
  AppSettingsForBreadcrumb,
  AppSettingsForFooter,
  AppSettingsForHeader,
  AppSettingsForLogo,
  AppSettingsForMenu,
  AppSettingsForTabs,
  AppSettingsForTheme,
} from './settings'

declare global {
  /**
   * Naive UI message placement type
   */
  type MessagePlacement =
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'

  /**
   * Naive UI notification placement type
   */
  type NotificationPlacement = NotificationPlacement

  /**
   * Lock route info
   */
  interface AppLockRoute {
    name?: string
    query?: Recordable
    params?: Recordable
  }

  /**
   * App adapter state
   */
  interface IAppStoreAdapter {
    device: ValueOfAppConstDevice
  }

  /**
   * App cached views state
   */
  interface IAppStoreCachedViews {
    cachedViewNameList: RouteRecordNameGeneric[]
  }

  /**
   * App secret key state
   */
  interface IAppStoreKey {
    baiduAK?: string
  }

  /**
   * App locale state
   */
  interface IAppStoreLocale {
    locale: Ref<ValueOfAppConstLocale | null>
  }

  /**
   * App capjs token state
   */
  interface IAppStoreCapJSToken {
    capJSInst: null | ICapInst
    capShow: boolean
    capComponent: null | string
    onCapSuccess: null | ((token: string) => void)
  }

  /**
   * App fingerprint state
   */
  interface IAppStoreFingerprint {
    fingerprint: Ref<string | null>
  }

  /**
   * App force quit state
   */
  interface IAppStoreForceQuit {
    modalShow: Ref<boolean | null>
    forceQuitComponent: null | string
    quitButton: boolean
  }

  /**
   * App geo ip state
   */
  interface IAppStoreGeoIP {
    geoInfo: Ref<Partial<ExternalGeoIPInfo> | null>
  }

  /**
   * App lock state
   */
  interface IAppStoreLock {
    isLock: Ref<boolean | null>
    lockRoute: Ref<AppLockRoute | null>
  }

  /**
   * App menu state
   */
  interface IAppStoreMenu {
    collapse: boolean
    showAside: boolean

    menus: TreeNodeItem<AppSystemMenu>[]
    keepAliveRouteNames: string[]
    indexMenuName?: string
  }

  /**
   * App naive ui message/notificaiton placement state
   */
  interface IAppStoreMsg {
    notiMax: number
    msgMax: number
    notiPlacement: NotificationPlacement
    msgPlacement: MessagePlacement
    notiContainerStyle: CSSProperties
    currentNotiInst: Nullable<NotificationReactive>
    currentMsgInst: Nullable<MessageReactive>
  }

  /**
   * App setting retrieved from backend state
   */
  interface IAppStoreSettingBackend {
    auth: Partial<AppPublicSettings.AuthSettings>
    frontend: Partial<AppPublicSettings.FrontendSettings>
  }

  /**
   * App setting state
   */
  interface IAppStoreSetting {
    themes: AppSettingsForTheme

    app: AppSettingsForApp

    logo: AppSettingsForLogo

    header: AppSettingsForHeader

    tabs: AppSettingsForTabs

    breadcrumb: AppSettingsForBreadcrumb

    menu: AppSettingsForMenu

    footer: AppSettingsForFooter
  }

  /**
   * App Sign state
   */
  interface IAppStoreSign {
    publicKey: Ref<string | null>
    privateKey: Ref<string | null>
    aesKey: Ref<string | null>
  }

  type IAppTabIframe = Pick<AppSystemMenu, 'name'> & Pick<AppSystemMenuMeta, 'cache' | 'url'>

  /**
   * App tab state
   */
  interface IAppStoreTab {
    tabs: AppTab[]
    iframeList: IAppTabIframe[]
    visitedTabs: Map<string, string[]>
  }

  interface ExternalGeoIPInfo {
    country: string
    city: string
    region?: string
    ip: string
    isp: string
    longitude?: number
    latitude?: number
    country_code: string
  }

  /**
   * User profile state
   */
  interface IUserStoreProfile {
    profile: Partial<AppSystemUser>
  }

  /**
   * User auth state
   */
  interface IUserStoreAuth {
    accessToken?: Ref<string | null>
    remember?: Ref<Partial<Omit<AppPayloadAuth.Password, 'rememberMe'>> | null>
  }

  /**
   * User permission state
   */
  interface IUserStorePermission {
    permissions: string[]
  }

  interface IUserStoreScroll {
    scrollEntries: Ref<[string, { top: number, left?: number }][] | null>
  }
}

export { }
