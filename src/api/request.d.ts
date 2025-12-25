import type { IModels } from './models'

export namespace IRequestPayload {
  export namespace App {}

  export namespace Auth {
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
      export interface Start {
        userName: string
        loginRequest: string
      }

      export interface Finish {
        userName: string
        loginFinish: string
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
