import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/browser'
import type { IModels } from './models'

export namespace IRequestPayload {
  export namespace App {}

  export namespace Auth {

    export namespace MFA {
      export namespace Totp {

        export interface Generate {
          name: string
        }

        export interface Bind {
          name: string
          code: string
          tempTotpId: string
        }

        export interface Verify {
          trusted: boolean
          code: string
        }
      }

      export namespace Webauthn {
        export interface RegisterOptions {
          name: string
        }

        export interface RegisterVerify {
          name: string
          response: RegistrationResponseJSON
        }

        export interface AuthenticateVerify {
          trusted: boolean
          response: AuthenticationResponseJSON
        }
      }
    }
    export interface KickOutAllDevices {
      type: string
    }

    export interface KickOutAllDevicesForAdmin extends KickOutAllDevices {
      _id: string
    }

    export namespace OTP {

      interface Base {
        type: 'sms' | 'email'
      }
      export interface Send extends Base {
        identifier: string
      }

      export interface Verify extends Send {
        verifyCode: number
      }
    }

    export interface Password {
      userName: string
      password: string
      rememberMe?: boolean
    }

    export interface Google {
      credential: string
      select_by: string
    }

    export namespace Opaque {

      export namespace Admin {
        export interface UpdatePasswordStart extends Opaque.Register.Start {
          _id: string
        }

        export interface UpdatePasswordFinish extends Opaque.Register.Finish {
          _id: string
        }

        export interface ResetPasswordStart extends Opaque.Register.Start {
          _id: string
        }

        export interface ResetPasswordFinish extends Opaque.Register.Finish {
          _id: string
        }
      }
      export namespace Login {
        export interface Start extends Pick<IModels.SystemUser, 'userName'>, Opaque.Register.Start {}

        export interface Finish extends Pick<IModels.SystemUser, 'userName'>, Opaque.Register.Finish {}

        export interface ClientError extends Pick<IModels.SystemUser, 'userName'> {
          clientError: 'passwordError' | 'serverStaticKeyMismatch'
        }
      }

      export namespace Register {
        export interface Start {
          start: string
        }

        export interface Finish {
          finish: string
        }
      }
    }
  }

  export namespace Security {}

  export namespace Shared {}

  export namespace System {

    export namespace UserIdentity {
      export interface Status {
        type: IModels.ISystemUserIdentityType
        purpose: IModels.ISystemUserIdentityPurpose
        status: boolean
      }
      export interface Verify {
        type: IModels.ISystemUserIdentityType
        purpose: IModels.ISystemUserIdentityPurpose
        verifyCode: string
      }
      export interface Check {
        type: IModels.ISystemUserIdentityType
        purpose: IModels.ISystemUserIdentityPurpose
        identifier: string
      }

      export interface Bind {
        type: IModels.ISystemUserIdentityType
        purpose: IModels.ISystemUserIdentityPurpose
        identifier: string
        verifyCode: string
        setAsSecurity: boolean
      }
    }
    export namespace Deleted {
      export type Recover = Pick<IModels.Base, '_id'> & Pick<IModels.SystemDeleted, 'deletedId'>
    }

    export namespace Deivce {
      export type Initial = IModels.SystemDevice
    }

    export namespace UserDevice {
      export interface UpdateName {
        deviceId: string
        deviceName: string
      }

      export interface ForceQuit {
        deviceId: string
      }

      export interface Lock {
        deviceId: string
      }

      export interface Unlock {
        deviceId: string
        lockPwdHash?: string
      }

    }
  }
}
