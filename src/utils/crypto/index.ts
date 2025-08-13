import { Encryption } from './symmetric/crypto'

// TODO need to remove
const { persist, request, response } = useAppEnvCrypto()

export const AppPersistEncryption = new Encryption({
  key: persist[0],
  iv: persist[1],
})

export const AppRequestEncryption = new Encryption({
  key: request[0],
  iv: request[1],
})

export const AppResponseEncryption = new Encryption({
  key: response[0],
  iv: response[1],
})
