/**
 * @description initial auth cert
 */
export async function initialAuthCertAPI() {
  const { httpUrl } = useAppEnvProxy()

  const res = await fetch(`${httpUrl}/auth/cert/client`, {
    method: 'GET',
  })

  const data = await res.json()

  return data.data as AppPayloadAuth.ClientCert
}
