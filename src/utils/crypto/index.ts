import { Encryption } from './symmetric/crypto'

// TODO need to remove
const { url } = useAppEnvCrypto()

export const AppUrlEncryption = new Encryption({
  key: url[0],
  iv: url[1],
  urlSafe: true,
})
