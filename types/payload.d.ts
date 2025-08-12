declare global {
  namespace AppPayloadAuth {
    // password payload
    interface Password {
      userName: string
      password: string
      rememberMe?: boolean
    }

    // email address payload
    interface EmailAddress {
      emailAddress: string
      verifyCode: number
    }

    // phone number payload
    interface PhoneNumber {
      phoneNumber: string
      verifyCode: number
    }

    interface TokenPayload {
      accessToken: string
    }

    // cert payload
    interface ClientCert {
      server_cert: string
      server_sn: string
      secret: string
    }

  }

  namespace AppPublicSettings {
    interface AuthSettings {
      account: number
      email: number
      phone: number
      qrcode: number
      gitee: number
      github: number
    }

    interface FrontendSettings {
      fullScreen: number
      search: number
      dark: number
      locale: number
    }
  }
}

export {}
