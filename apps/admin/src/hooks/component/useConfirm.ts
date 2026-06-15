import type { DialogOptions } from 'naive-ui'

export function useAppDialog() {
  return window.$dialog
}

/**
 * @description some cases need to ask for user confirm to continue next action
 */
export function useAppConfirm(msg: string, options?: DialogOptions) {
  const dialog = useAppDialog()

  return new Promise<{ confirmed: boolean, inst: ReturnType<typeof dialog.warning> }>((resolve) => {
    const inst = dialog.warning({
      title: AppI18n().global?.t('app.base.warning'),
      content: msg,
      negativeText: AppI18n().global?.t('app.base.no'),
      positiveText: AppI18n().global?.t('app.base.yes'),
      autoFocus: false,
      ...options,
      onPositiveClick: () => {
        resolve({ confirmed: true, inst })
      },
      onNegativeClick: () => {
        resolve({ confirmed: false, inst })
      },
      onClose: () => {
        resolve({ confirmed: false, inst })
        inst.destroy()
      },
      onMaskClick: () => {
        if (options?.maskClosable === undefined || options.maskClosable === true) {
          resolve({ confirmed: false, inst })
          inst.destroy()
        }
      },
    })
  })
}
