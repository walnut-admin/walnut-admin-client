import type { IModels } from './models'

export namespace IRequestPayload {
  export namespace App {}

  export namespace Auth {

    export namespace MFA {
      export interface TotpGenerate {
        name: string
      }
      export interface TotpBind {
        name: string
        code: string
        tempTotpId: string
      }
    }
    export interface KickOutAllDevices {
      type: string
    }

    export interface KickOutAllDevicesForAdmin extends KickOutAllDevices {
      _id: string
    }

    export namespace Email {
      export interface Verify {
        emailAddress: string
        verifyCode: number
      }
      export interface Send {
        emailAddress: string
      }
    }

    export namespace Phone {
      export interface Verify {
        phoneNumber: string
        verifyCode: number
      }
      export interface Send {
        phoneNumber: string
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
        export interface Start extends Pick<IModels.SystemUser, 'userName'> {
          loginRequest: string
        }

        export interface Finish extends Pick<IModels.SystemUser, 'userName'> {
          loginFinish: string
        }
      }

      export namespace Register {
        export interface Start {
          registrationRequest: string
        }

        export interface Finish {
          registrationRecord: string
        }
      }
    }
  }

  export namespace Security {}

  export namespace Shared {}

  export namespace System {
    export namespace Deleted {
      export type Recover = Pick<IModels.Base, '_id'> & Pick<IModels.SystemDeleted, 'deletedId'>
    }

    export namespace Deivce {
      export type Initial = IModels.SystemDevice
    }
  }
}
