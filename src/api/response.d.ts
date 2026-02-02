import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser'
import type { TreeNodeItem } from 'easy-fns-ts'
import type { RouteRecordRaw } from 'vue-router'
import type { IModels } from './models'
import type { IStoreApp, IStoreSetting, IStoreUser } from '@/store/types'

export namespace IResponseData {
  export interface BackendDeps {
    dependencies: Recordable
    devDependencies: Recordable
  }

  export namespace App {
    export namespace Monitor {
      export interface CPU {
        cores: number
        brand: string
        speed: number
        manufacturer: string
      }

      export interface Mem {
        total: number
        free: number
        used: number
        avaiable: number
      }

      export interface OS {
        hostname: string
        arch: string
        platform: string
        distro: string
      }

      export interface System {
        manufacturer: string
        model: string
        version: string
        uuid: string
      }

      export interface Disk {
        name: string
        size: number
        device: string
        type: string
      }

      export interface Battery {
        voltage: number
        designedCapacity: number
        currentCapacity: number
        percent: number
      }

      export interface Time {
        current: number
        uptime: number
        timezone: string
        timezoneName: string
      }

      export interface Network {
        iface: string
        ip4: string
        mac: string
        netSpeed: string
      }
    }

    export namespace Key {
      export interface Current {
        keyB64: string
      }
    }

    export type SettingPublic = IStoreApp.SettingBackend

    export type SettingPrivate = IStoreSetting.Scope
  }

  export namespace Auth {
    export interface TokenPayload {
      accessToken: string
      sessionKey: string
    }

    export namespace MFA {
      export type AvailableMethods = {
        type: 'totp' | 'webauthn'
        enabled: boolean
      }[]

      export namespace Webauthn {
        export interface RegisterOptions {
          options: PublicKeyCredentialCreationOptionsJSON
        }

        export interface AuthenticateOptions {
          options: PublicKeyCredentialRequestOptionsJSON
        }
      }

      export namespace Totp {
        export interface Generate {
          totpId: string
          secret: string
          qrCode: string
          account: string
        }

        export interface Status {
          enabled: boolean
          boundAt?: string
          lastUsedAt?: string
        }

        export interface Bind {
          backupCodes: string[]
        }
      }

    }

    export interface Permissions {
      permissionMenuTree: TreeNodeItem<IModels.SystemMenu>[]
      permissionRouteTree: RouteRecordRaw[]
      permissionStrings: string[]
      keepAliveNames: string[]
      indexMenuName: string
      affixedTabs: IStoreApp.Tab.Item[]
      internalIframeList: { name: string, url: string, cache: boolean }[]
    }

    export interface Profile {
      user: IModels.SystemUser
    }

    export interface Keys {
      B: string
    }
  }

  export namespace Security {
    export namespace Sign {
      export interface AesKey {
        aesKey?: string
        hkdfInfo: string
      }
    }
  }

  export namespace Shared {
    export interface AliStsToken {
      accessKeyId: string
      accessKeySecret: string
      stsToken: string
      region: string
      bucket: string
    }

    export type Area = IModels.SharedArea
  }

  export namespace System {
    export namespace Device {
      export interface Initial {
        deviceId: string
        longitude?: number
        latitude?: number
        countryCode?: string
      }

      export type CurrentActiveUser = IModels.SystemUser
      export type HistoryUsers = IModels.SystemUser[]
    }

    export namespace Dict {
      export type DataPicked = Pick<IModels.SystemDictData, 'value' | 'label' | 'description' | 'order' | 'tagType'>

      export type MapDictValue = (Pick<IModels.SystemDictType, 'type' | 'name'> & { dictData: DataPicked[] })
    }

    export namespace Lang {
      export type Public = Pick<IModels.SystemLang, 'lang' | 'description' | 'order'>[]
    }

    export namespace Menu {
      export interface Tree {
        fullTree: TreeNodeItem<IModels.SystemMenu>[]
        treeWithoutTypeElement: TreeNodeItem<IModels.SystemMenu>[]
        menuActiveNamesOptions: Pick<IModels.SystemMenu, 'title' | 'name'>[]
      }
    }

    export namespace User {
      export type Lock = boolean
      export type Unlock = boolean
      export type LockStatus = IModels.SystemUserLockPreference & Pick<IModels.SystemUserDevice, 'locked'>
      export type Preference = IStoreUser.Preference.State
    }

    export namespace LogOperate {
      export interface Snapshot {
        snapshotBefore: Recordable
        snapshotAfter: Recordable
      }
      export type Device = IModels.SystemLogOperateDevice
    }
  }
}
