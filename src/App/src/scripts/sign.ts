import { authSignHandShakeAPI, authSignSessionKeyAPI } from '@/api/auth/sign'

const serverSnRef = useAppStorage<string>(AppConstPersistKey.SERVER_SN, '', { usePresetKey: false, expire: 7 * 24 * 3600 * 1000, encrypt: false })
const encryptedSessionRef = useAppStorage<string>(AppConstPersistKey.ENCRYPTED_SESSION, '', { usePresetKey: false, expire: 7 * 24 * 3600 * 1000, encrypt: false })
const serverCert = ref<string>()

export function getSignCache() {
  return {
    serverSn: serverSnRef.value,
    secret: encryptedSessionRef.value,
  }
}

export async function setupSign() {
  if (serverSnRef.value)
    return

  // 1. handshake
  const res1 = await authSignHandShakeAPI()
  serverCert.value = res1.serverCert
  serverSnRef.value = res1.serverSn

  if (encryptedSessionRef.value) {
    return
  }

  // 2. Generate a 32-byte AES session key (secret)
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const aesKey = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')

  // 3. Encrypt the AES key with RSA-OAEP
  const encryptedAes = await encryptAesKeyOAEP(aesKey, res1.rsaPubKey) as string

  // 4. Call the /auth/sign/sessionkey endpoint to obtain the sessionKey
  const res2 = await authSignSessionKeyAPI(encryptedAes)
  encryptedSessionRef.value = res2.encrypted_session
}
