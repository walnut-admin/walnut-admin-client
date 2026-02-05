import type { Recordable } from 'easy-fns-ts'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

const { ws } = useAppEnvProxy()
const useProxy = +ws[0] === 1
const url = useProxy ? `/${ws[4]}` : `${ws[2]}/${ws[4]}`
const path = useProxy ? ws[1] : ws[3]

let socket: Socket | null = null

// ✅ 事件处理器映射表
const eventHandlers: Map<string, (payload: any) => void> = new Map()

/**
 * 注册事件处理器（可以在 Vue 组件中调用）
 */
export function registerSocketEvent(event: string, handler: (payload: any) => void) {
  eventHandlers.set(event, handler)

  // 如果 socket 已经初始化，立即注册
  if (socket) {
    socket.on(event, handler)
  }
}

/**
 * 取消注册事件
 */
export function unregisterSocketEvent(event: string) {
  const handler = eventHandlers.get(event)
  if (handler && socket) {
    socket.off(event, handler)
  }
  eventHandlers.delete(event)
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

  // ✅ 注册 FORCE_QUIT 事件
  socket.on(AppSocketEvents.FORCE_QUIT, async (payload: { strategy: string }) => {
    console.log('[Socket] FORCE_QUIT received:', payload.strategy)

    const strategyMap: Recordable = {
      FORCE_IMMEDIATE_SIGNOUT: async () => {
        await useAppStoreUserAuth().Signout()
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

  // ✅ 重新注册所有已注册的事件
  eventHandlers.forEach((handler, event) => {
    socket?.on(event, handler)
    console.info(`[Socket] Re-registered event: ${event}`)
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
