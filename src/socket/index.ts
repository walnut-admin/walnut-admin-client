import type { Recordable } from 'easy-fns-ts'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { SingletonPromise } from '@/utils/queue'

const { ws } = useAppEnvProxy()
const useProxy = +ws[0] === 1
const url = useProxy ? `/${ws[4]}` : `${ws[2]}/${ws[4]}`
const path = useProxy ? ws[1] : ws[3]

let socket: Socket | null = null

const socketInit = new SingletonPromise<Socket>(false)

export async function getSocket(): Promise<Socket> {
  return socketInit.run(() => setupSocket())
}

export function setupSocket() {
  if (socket) {
    console.info('[Socket] Already initialized')
    return Promise.resolve(socket)
  }

  const userStoreAuth = useAppStoreUserAuth()
  const appStoreLocale = useAppStoreLocale()
  const appStoreFingerprint = useAppStoreFingerprint()

  socket = io(url, {
    path,
    withCredentials: true,
    extraHeaders: {
      [AppConstRequestHeaders.AUTHORIZATION]: `Bearer ${userStoreAuth.getAccessToken}`,
      [AppConstRequestHeaders.LANGUAGE]: appStoreLocale.getLocale,
      [AppConstRequestHeaders.FINGERPRINT]: appStoreFingerprint.getFingerprint,
    },
  })

  socket.on('connect', () => {
    console.info('[Socket] Connected')
  })

  socket.on('error', (err) => {
    console.error('[Socket] Error:', err)
  })

  socket.on(AppSocketEvents.FORCE_QUIT, async (payload: { strategy: string }) => {
    const strategyMap: Recordable = {
      FORCE_IMMEDIATE_SIGNOUT: async () => {
        await userStoreAuth.Signout()
      },
      FORCE_COUNTDOWN_MODAL: () => {
        useStoreCompForceQuit().onOpenForceQuitModal()
      },
      MANUAL_COUNTDOWN_MODAL: () => {
        useStoreCompForceQuit().onOpenForceQuitModal(true)
      },
    }

    const handler = strategyMap[payload.strategy]
    if (handler)
      await handler()
  })

  console.info('[Socket] Initialized successfully')
  return Promise.resolve(socket)
}

export function destroySocket() {
  if (socket) {
    socket.disconnect()
    socket = null
    console.info('[Socket] Disconnected')
  }
}
