import { Encryption } from './symmetric/crypto'

// TODO key module in backend support
const { url } = useAppEnvCrypto()

export const AppUrlEncryption = new Encryption({
  key: url[0],
  iv: url[1],
  urlSafe: true,
})
