const { httpUrl } = useAppEnvProxy()

/**
 * @description auth sign handshake, need to diff from AppAxios instance
 */
export async function authSignHandShakeAPI() {
  const res = await fetch(`${httpUrl}/auth/sign/handshake`, {
    method: 'GET',
  })

  const data = await res.json()

  return data.data as AppPayloadAuth.SignHandShakePayload
}

/**
 * @description auth sign session key
 */
export async function authSignSessionKeyAPI(encryptedAes: string) {
  return await AppAxios.post<AppPayloadAuth.SignSessionKeyPayload>({
    url: `/auth/sign/sessionkey`,
    data: {
      encryptedAes,
    },
  })
}
