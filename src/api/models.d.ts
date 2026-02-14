import type { PromiseFn, Recordable } from 'easy-fns-ts'
import type { WatermarkProps } from 'naive-ui'
import type { ValueOfAppConstCacheKeyStrategy, ValueOfAppConstLockMode, ValueOfAppConstMenuTernal, ValueOfAppConstMenuType, ValueOfAppConstTransitionName } from '@/const'

export namespace IModels {
  export interface Base {
    _id?: string
    createdAt?: Date
    updatedAt?: Date
  }

  // system menu meta
  export interface SystemMenuMeta {
    order?: number
    ternal?: ValueOfAppConstMenuTernal
    url?: string
    show?: boolean
    cache?: boolean
    cacheKeyStrategy?: ValueOfAppConstCacheKeyStrategy
    status?: boolean
    affix?: boolean
    permission?: string
    badge?: string
    menuActiveName?: string
    menuActiveSameTab?: boolean
    activeIcon?: string
    position?: boolean
    leaveTip?: boolean

    // scope meta
    maskUrl?: boolean
    transition?: ValueOfAppConstTransitionName
    hijackRefresh?: boolean
    watermark?: WatermarkProps
  }

  // system menu
  export interface SystemMenu extends Base {
    pid?: string
    type?: ValueOfAppConstMenuType
    path?: string
    name?: string
    component?: string | PromiseFn
    title?: string
    icon?: string

    meta: SystemMenuMeta
  }

  // system role
  export interface SystemRole extends Base {
    roleName?: string
    description?: string
    order?: number
    menus?: string[]
    status?: boolean
  }

  // system user
  export interface SystemUser extends Base {
    userName?: string
    nickName?: string
    age?: number
    gender?: string

    description?: string
    avatar?: string
    status?: boolean
    roles?: string[]
    roleMode?: 'switchable' | 'combinable'
    currentRole?: string

    populated_roles_list?: SystemRole[]
  }

  // system user lock preference
  export interface SystemUserLockPreference extends Base {
    lockCrossDevice: boolean
    lockRoute: Recordable
    lockMode: ValueOfAppConstLockMode
    lockIdleSec: number
    lockSecuritySec: number
  }

  // system user device
  export interface SystemUserDevice extends Base {
    deviceId: string
    deviceName: string
    userId: string
    locked: boolean
    lastActive?: Date
  }

  // system device
  export interface SystemDevice extends Base {
    deviceName?: string
    deviceId?: string
    deviceInfo?: {
      os?: string
      browser?: string
      type?: string
      netType?: string
      platform?: string
      isp?: string
    }
    hardwareInfo?: {
      cpuCores?: number
      memory?: number
      gpu?: string
    }
    sr?: {
      height: number
      width: number
    }
    vp?: {
      height: number
      width: number
    }
    ipHistory?: string[]
    active?: boolean
    locked?: boolean
    banned?: boolean
    riskScore?: number
    geoLocation?: {
      type: 'Point'
      coordinates: [number, number]
    }
    locationInfo?: {
      country?: string
      region?: string
      city?: string
    }

    // query
    location?: string
  }

  // system lang
  export interface SystemLang extends Base {
    lang?: string
    description?: string
    order?: number
    status?: boolean

    // translate process, calculated in backend
    process?: number
  }

  // system locale
  export interface SystemLocale extends Base {
    langId?: string
    key?: string
    value?: string
    process?: number
    oldKey?: string
  }

  // system dict type
  export interface SystemDictType extends Base {
    name?: string
    type?: string
    status?: boolean
    description?: string
  }

  // system dict data
  export interface SystemDictData extends Base {
    typeId?: string
    label?: string
    value?: string
    order?: number
    status?: boolean
    description?: string
    tagType?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  }

  // system operate log
  export interface SystemLogOperate extends Base {
    title?: string
    actionType?: string
    method?: string
    url?: string
    heepVersion?: string
    statusCode?: number
    requestData?: string
    responseData?: string
    userId?: string
    userName?: string
    ip?: string
    invokingMethod?: string
    operatedAt?: Date | string | [string, string]
    os?: string
    browser?: string
    success?: boolean
    location?: string
    correspondingMS?: number
  }

  // system signin log
  export interface SystemLogAuth extends Base {
    ip?: string
    location?: string
    os?: string
    browser?: string
    userId?: string
    userName?: string
    msg?: string
    success?: boolean
    authTime?: Date
  }

  // system delete
  export interface SystemDeleted extends Omit<Base, 'updatedAt'> {
    content?: string
    modelName?: string
    collectionName?: string
    deletedId?: string
    deletedAt?: Date
    deletedBy?: string
    logOperateId?: string

    populated_user?: SystemUser
  }

  // app setting
  export interface AppSettings extends Base {
    settingName?: string
    settingKey?: string
    settingValue?: string
    remark?: string
  }

  // app error
  export interface AppError extends Base {
    message?: string
    stack?: string
    statusCode?: number
    path?: string
    method?: string
    headers?: Recordable
    payload?: Recordable
    errorType?: string
    userId?: string
    responseCode?: number
    responseMsg?: string
    ip?: string
    deviceId?: string
  }

  // app logger
  export interface AppLogger extends Base {
    fileName?: string
    filePath?: string
    fileSize?: number
    fileMTime?: Date
    fileContent?: string[]
  }

  // app monitor cache model
  export interface AppMonitorCache extends Base {
    key?: string
    value?: string
    type?: 'built-in' | 'auth-permissions' | 'verify-code' | 'controller' | 'shared-area' | 'sys-locale-messages' | 'sys-lang-id-list' | 'sys-device-id-list'
    valueBytes?: string
    expire?: string
    startTime?: string
    expireTime?: string
  }

  // app monitor user model
  export interface AppMonitorUser extends Omit<Base, 'createdAt' | 'updatedAt'> {
    visitorId: string
    userId?: string | null
    deviceId?: string

    auth: boolean
    focus: boolean
    left: boolean
    currentRouter: string

    firstVisitAt?: Date
    lastActiveAt?: Date

    populated_device?: SystemDevice
    populated_user?: SystemUser
  }

  // shared area
  export interface SharedArea {
    code?: string
    name?: string
    pcode?: string
  }
}
