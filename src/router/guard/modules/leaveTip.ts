import type { Router } from 'vue-router'

let removeEvent: Fn

export function createLeaveTipGuard(router: Router) {
  // beforeEach
  router.beforeEach(async (to, from) => {
    // enter the `leaveTip` page, hang on the unload event
    if (to.meta.leaveTip) {
      // if the old event listener not removed, remove it
      if (removeEvent)
        removeEvent()

      removeEvent = useEventListener('beforeunload', (e) => {
        e.preventDefault()
        e.returnValue = '关闭提示'
        return '关闭提示'
      })
    }

    // when leaving from the `leaveTip` page
    // ask user for confirm
    // also remember to remove the unload event to make sure this only work on the `leaveTip` page
    if (from.meta.leaveTip && to.name !== from.name) {
      const { confirmed } = await useAppConfirm(AppI18n().global.t('app.base.leaveTip'), {
        closable: false,
        closeOnEsc: false,
        maskClosable: false,
      })

      if (!confirmed)
        return { ...from, replace: true }

      window.$loadingBar?.start()
      removeEvent()
    }
  })
}
