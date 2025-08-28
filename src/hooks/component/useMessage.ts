import type { MessageType } from 'naive-ui'

export function useAppMessage() {
  return window.$message
}

interface AppMessageOptions {
  type?: MessageType
  duration?: number
  closable?: boolean
  placement?: MessagePlacement
}

/**
 * @description message usage
 */
export function AppMsg(msg: string, options: AppMessageOptions) {
  const appStoreNaive = useAppStoreNaive()

  appStoreNaive.setMsgPlacement(options?.placement ?? 'top')

  useAppMessage().create(msg, {
    duration: options?.duration ?? 3000,
    closable: options?.closable ?? true,
    type: options.type,
  })
}

export function useAppMsgSuccess(msg?: string, options?: Omit<AppMessageOptions, 'type'>) {
  return AppMsg(msg ?? AppI18n().global?.t('app.base.operation.success'), {
    ...options,
    type: 'success',
  })
}

export function useAppMsgInfo(msg: string, options?: Omit<AppMessageOptions, 'type'>) {
  return AppMsg(msg, { ...options, type: 'info' })
}

export function useAppMsgWarning(msg: string, options?: Omit<AppMessageOptions, 'type'>) {
  return AppMsg(msg, { ...options, type: 'warning' })
}

export function useAppMsgError(msg: string, options?: Omit<AppMessageOptions, 'type'>) {
  return AppMsg(msg, { ...options, type: 'error' })
}
