import type { Nullable, OptionDataItem, Recordable, TreeNodeItem } from 'easy-fns-ts'
import type { MessageReactive, NotificationPlacement, NotificationReactive } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { RouteMeta, RouteRecordNameGeneric } from 'vue-router'
import type { IModels } from '@/api/models'
import type { IRequestPayload } from '@/api/request'
import type { ValueOfAppConstDevice, ValueOfAppConstLocale, ValueOfAppConstScrollMode, ValueOfAppConstTabUtilsShowMode, ValueOfAppConstTransitionName } from '@/const'

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
    deviceId: Ref<string>
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
    loading: boolean
    locked: boolean
    lockRoute: LockRoute
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
    elementId: string
    loading: boolean
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
   * User preference state
   */
  export interface Preference {
    app: {
      /**
       * @description dark or light
       * @default false
       */
      isDark: boolean

      /**
       * @description app locale
       * @default en_US
       */
      locale: ValueOfAppConstLocale

      /**
       * @description for those who cannot see animation viewing the internet
       * @default false
       */
      reducedMotion: boolean

      /**
       * @description just different css tricks to fit the app in view
       * @default default
       */
      colorMode: ValueOfAppConstColorMode

      /**
       * @description App Layout
       * @default left-menu
       */
      layout: ValueOfAppConstLayoutMode
    }

    themes: {
      light: {
        /**
         * @description Primary color for light theme
         * @default #409eff
         */
        primaryColor: string

        /**
         * @description Info color for light theme
         * @default #1890ff
         */
        infoColor: string

        /**
         * @description Success color for light theme
         * @default #52c41a
         */
        successColor: string

        /**
         * @description Warning color for light theme
         * @default #faad14
         */
        warningColor: string

        /**
         * @description Error color for light theme
         * @default #f5222d
         */
        errorColor: string

        /**
         * @description Body color for light theme
         * @default #f8f8f8
         */
        bodyColor: string

        /**
         * @description Inverted color for light theme
         * @default #2C3E50
         */
        invertedColor: string
      }

      dark: {
        /**
         * @description Primary color for dark theme
         * @default #7cb305
         */
        primaryColor: string

        /**
         * @description Info color for dark theme
         * @default #0284c7
         */
        infoColor: string

        /**
         * @description Success color for dark theme
         * @default #10b981
         */
        successColor: string

        /**
         * @description Warning color for dark theme
         * @default #f59e0b
         */
        warningColor: string

        /**
         * @description Error color for dark theme
         * @default #ef4444
         */
        errorColor: string

        /**
         * @description Body color for dark theme
         * @default #202020
         */
        bodyColor: string

        /**
         * @description Inverted color for dark theme
         * @default #2C3E50
         */
        invertedColor: string
      }
    }

    header: {
      /**
       * @description Invert header colors
       * @default false
       */
      inverted: boolean
    }

    tabs: {
      /**
       * @description Invert tab colors
       * @default false
       */
      inverted: boolean

      /**
       * @description Show icon in tabs
       * @default true
       */
      showIcon: boolean

      /**
       * @description Tab style mode
       * @default card
       */
      styleMode: ValueOfAppConstTabStyleMode

      /**
       * @description Tab close behavior mode
       * @default all
       */
      closeMode: ValueOfAppConstTabCloseMode

      /**
       * @description Tab affix behavior mode
       * @default click
       */
      affixMode: ValueOfAppConstTabAffixMode
    }

    breadcrumb: {
      /**
       * @description Show icon in breadcrumb
       * @default false
       */
      showIcon: boolean

      /**
       * @description Show dropdown in breadcrumb items
       * @default true
       */
      showDropdown: boolean
    }

    menu: {
      /**
       * @description Invert menu colors
       * @default false
       */
      inverted: boolean

      /**
       * @description Menu collapse behavior mode
       * @default click
       */
      collapseMode: ValueOfAppConstCollapseMode
    }

    footer: {
      /**
       * @description Invert footer colors
       * @default false
       */
      inverted: boolean
    }
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

export namespace IStoreSetting {
  /**
   * Pure front-end developer environment configuration
   * Contains development debugging, implementation details, configurations that may affect application stability
   */
  export interface Dev {
    app: {
    /**
     * @description Keep Alive component, vue features
     * @default true
     */
      keepAlive: boolean

      /**
       * @description content or wrapper, scrollbar may have part covered in wrapper mode
       * @default wrapper
       */
      scrollMode: ValueOfAppConstScrollMode

      /**
       * @description Content padding px
       * @default 4
       */
      contentPadding: number
    }

    logo: {
    /**
     * @description DOM element id
     * @default walnut-admin-logo
     */
      id: string

      /**
       * @description Development debugging visibility control
       * @default true
       */
      status: boolean

      /**
       * @description True => fixed positioning, false => normal flow
       * @default true
       */
      fixed: boolean

      /**
       * @description Transition animation name
       * @default slideLeft
       */
      transition: ValueOfAppConstTransitionName
    }

    header: {
    /**
     * @description DOM element id
     * @default walnut-admin-header
     */
      id: string

      /**
       * @description Development debugging visibility control
       * @default true
       */
      status: boolean

      /**
       * @description Whether header is fixed
       * @default true
       */
      fixed: boolean

      /**
       * @description Transition animation name
       * @default slideUp
       */
      transition: ValueOfAppConstTransitionName

      /**
       * @description Header height
       * @default 48
       */
      height: number

      /**
       * @description Show header when scrolling up (when not fixed)
       * @default false
       */
      scrollUpShow: boolean

      /**
       * @description Keep header visible on hover (when scrollUpShow is true)
       * @default false
       */
      liveOnHover: boolean
    }

    tabs: {
    /**
     * @description DOM element id
     * @default walnut-admin-tabs
     */
      id: string

      /**
       * @description Development debugging visibility control
       * @default true
       */
      status: boolean

      /**
       * @description True => fixed positioning, false => normal flow
       * @default true
       */
      fixed: boolean

      /**
       * @description Tab height
       * @default 36
       */
      height: number

      /**
       * @description Tab item width
       * @default 120
       */
      itemWidth: number

      /**
       * @description Transition animation name
       * @default slideUp
       */
      transition: ValueOfAppConstTransitionName

      /**
       * @description Whether to persist tab state
       * @default true
       * @deprecated wait for next version
       */
      persistent: boolean

      /**
       * @description Tab item transition animation
       * @default fadeDown
       */
      itemTransition: ValueOfAppConstTransitionName

      /**
       * @description Show tabs when scrolling up (when not fixed)
       * @default false
       */
      scrollUpShow: boolean

      /**
       * @description Keep tabs visible on hover (when scrollUpShow is true)
       * @default false
       */
      liveOnHover: boolean

      /**
       * @description Tab aside utils visibility
       * @default true
       */
      showUtils: boolean

      /**
       * @description Tab aside utils display mode
       * @default overflow
       */
      utilsMode: ValueOfAppConstTabUtilsShowMode

      /**
       * @description Tab context menu visibility
       * @default true
       */
      contextMenu: boolean

      /**
       * @description Tab sortable
       * @default true
       */
      sortable: boolean
    }

    breadcrumb: {
    /**
     * @description DOM element id
     * @default walnut-admin-breadcrumb
     */
      id: string

      /**
       * @description Development debugging visibility control
       * @default true
       */
      status: boolean

      /**
       * @description Transition animation name
       * @default fadeDown
       */
      transition: ValueOfAppConstTransitionName

      /**
       * @description Breadcrumb custom separator
       * @default >
       */
      separator: string
    }

    menu: {
      /**
       * @description DOM element id
       * @default walnut-admin-menu
       */
      id: string

      /**
       * @description Development debugging visibility control
       * @default true
       */
      status: boolean

      /**
       * @description Transition animation name
       * @default slideLeft
       */
      transition: ValueOfAppConstTransitionName

      /**
       * @description Menu item indentation pixels
       * @default 16
       */
      indent: number

      /**
       * @description When app layout is `left-menu`, menu width
       * @default 240
       */
      width: number

      /**
       * @description Menu icon size
       * @default 24
       */
      iconSize: number

      /**
       * @description Show collapse button
       * @default true
       */
      collapseStatus: boolean

      /**
       * @description Menu collapsed icon size
       * @default 20
       */
      collapsedIconSize: number

      /**
       * @description When app layout is `left-menu`, menu collapsed width
       * @default 64
       */
      collapsedWidth: number

      /**
       * @description Enable accordion mode for menu
       * @default true
       */
      accordion: boolean
    }

    footer: {
    /**
     * @description DOM element id
     * @default walnut-admin-footer
     */
      id: string

      /**
       * @description Development debugging visibility control
       * @default true
       */
      status: boolean

      /**
       * @description True => fixed positioning, false => normal flow
       * @default true
       */
      fixed: boolean

      /**
       * @description Transition animation name
       * @default slideDown
       */
      transition: ValueOfAppConstTransitionName

      /**
       * @description Footer height
       * @default 28
       */
      height: number

      /**
       * @description Custom footer content
       * @default Copyright © 2020-present Walnut Admin. All Rights Reserved.
       */
      content: string
    }
  }

  export interface Scope {}
}
