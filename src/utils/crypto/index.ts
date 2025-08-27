import { Encryption } from './symmetric/crypto'

// TODO need to remove
const { url, request, response } = useAppEnvCrypto()

export const AppUrlEncryption = new Encryption({
  key: url[0],
  iv: url[1],
  urlSafe: true,
})

export const AppRequestEncryption = new Encryption({
  key: request[0],
  iv: request[1],
})

export const AppResponseEncryption = new Encryption({
  key: response[0],
  iv: response[1],
})
