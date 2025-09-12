import type { Nullable, OptionDataItem, Recordable, TreeNodeItem } from 'easy-fns-ts'
import type { MessageReactive, NotificationPlacement, NotificationReactive } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { RouteMeta, RouteRecordNameGeneric } from 'vue-router'
import type { IModels } from '@/api/models'
import type { IRequestPayload } from '@/api/request'
import type { ValueOfAppConstDevice, ValueOfAppConstLocale } from '@/const'

export namespace IStoreApp {
  /**
   * App adapter state
   */
  export interface Adapter {
    device: ValueOfAppConstDevice
  }

  /**
   * App cached views state
   */
  export interface CachedViews {
    cachedViewNameList: RouteRecordNameGeneric[]
  }

  /**
   * App fingerprint state
   */
  export interface Fingerprint {
    fingerprint: Ref<Nullable<string>>
  }

  export interface GeoIPInfo {
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
   * App geo ip state
   */
  export interface GeoIP {
    geoInfo: Ref<Nullable<Partial<GeoIPInfo>>>
  }

  /**
   * App secret key state
   */
  export interface Key {
    baiduAK?: string
    urlMaskingAesKey?: CryptoKey
  }

  /**
   * App locale state
   */
  export interface Locale {
    locale: Ref<Nullable<ValueOfAppConstLocale>>
    baseI18nKeyList: string[]
    langList: OptionDataItem[]
  }

  /**
   * Lock route info
   */
  export interface LockRoute {
    name?: string
    query?: Recordable
    params?: Recordable
  }

  /**
   * App lock state
   */
  export interface Lock {
    isLock: Ref<Nullable<boolean>>
    lockRoute: Ref<Nullable<LockRoute>>
  }

  /**
   * App menu state
   */
  export interface Menu {
    collapse: boolean
    showAside: boolean

    menus: TreeNodeItem<IModels.SystemMenu>[]
    keepAliveRouteNames: string[]
    indexMenuName?: string
  }

  /**
   * App naive ui message/notificaiton placement state
   */
  export interface Naive {
    notiMax: number
    msgMax: number
    notiPlacement: NotificationPlacement
    msgPlacement: NotificationPlacement
    notiContainerStyle: CSSProperties
    currentNotiInst: Nullable<NotificationReactive>
    currentMsgInst: Nullable<MessageReactive>
  }

  /**
   * App Security state
   */
  export interface Security {
    serverRsaPubKey: string
    clientRsaPubKey: Ref<Nullable<string>>
    clientRsaPrivKey: Ref<Nullable<string>>
    signAesSecretKey: string
  }

  /**
   * App setting retrieved from backend state
   */
  export interface SettingBackend {
    auth: Partial<{
      account: number
      email: number
      phone: number
      qrcode: number
      gitee: number
      github: number
    }>
    frontend: Partial<{
      fullScreen: number
      search: number
      dark: number
      locale: number
    }>
  }

  /**
   * App tab state
   */
  export namespace Tab {
    export type Iframe = Pick<IModels.SystemMenu, 'name'> & Pick<IModels.SystemMenuMeta, 'cache' | 'url'>

    /**
     * @description app tab meta extend fields
     */
    export interface MetaExtend {
    /**
     * @description tab hover state, manually managed
     */
      _hovered?: boolean

      /**
       * @description whether confirmed leave already, used to fixed the `tab-close-self` and `route-guard` conflict with each other
       */
      _confirm_leave?: boolean

      /**
       * @description this is a hack for the changed title
       * first try to render this, normally undefined
       * then try to render title
       * used for dynamic tab title
       */
      _title?: string

      /**
       * @description _title scroll speed
       */
      _title_speed?: number

      /**
       * @description max length to scroll
       * default is 10
       */
      _title_maxLength?: number

      /**
       * @description this is a hack for the changed icon
       * first try to render this, normally undefined
       * then try to render icon
       * used for dynamic tab icon
       */
      _icon?: string

      /**
       * @description _icon animate type
       */
      _icon_animate?: boolean

      /**
       * @description _icon animate speed
       */
      _icon_animate_duration?: 1000 | 2000 | 3000 | 4000
    }

    export type Meta = RouteMeta & MetaExtend

    export interface Item {
      name: string
      path: string
      meta: Meta
      query?: Recordable
      params?: Recordable
    }

    export interface MetaExtendTitleOptions {
      timeout?: number
      speed?: number
      maxLength?: number
    }

    export interface MetaExtendIconOptions {
      timeout?: number
      animate?: boolean
      duration?: 1000 | 2000 | 3000 | 4000
    }

    export interface State {
      tabs: Item[]
      iframeList: Iframe[]
      visitedTabs: Map<string, string[]>
    }
  }
}

export namespace IStoreComp {
  /**
   * comp capjs token state
   */
  export interface CapJS {
    inst: Nullable<ICapInst>
    show: boolean
    onSuccess: Nullable<(token: string) => void>
  }

  /**
   * comp force quit state
   */
  export interface ForceQuit {
    show: Ref<Nullable<boolean>>
    quitButton: boolean
  }

  /**
   * comp reload prompt state
   */
  export interface ReloadPrompt {
    needRefresh: boolean
    offlineReady: boolean
    reloadFn: () => void
  }
}

export namespace IStoreUser {
  /**
   * User auth state
   */
  export interface Auth {
    accessToken?: Ref<string | null>
    remember?: Ref<Partial<Omit<IRequestPayload.Auth.Password, 'rememberMe'>> | null>
  }

  /**
   * User permission state
   */
  export interface Permission {
    permissions: string[]
  }

  /**
   * User profile state
   */
  export interface Profile {
    profile: Partial<IModels.SystemUser>
  }

  /**
   * User scroll state
   */
  export interface Scroll {
    scrollEntries: Ref<[string, { top: number, left?: number }][] | null>
  }
}
