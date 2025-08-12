import { initialAuthCertAPI } from '@/api/auth/cert'

const certCache = shallowRef<AppPayloadAuth.ClientCert>()

export const getCertCache = () => certCache.value!

export async function setupClientCert() {
  if (certCache.value)
    return

  const res = await initialAuthCertAPI()

  certCache.value = res
}
