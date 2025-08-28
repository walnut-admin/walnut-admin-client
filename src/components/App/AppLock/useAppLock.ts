import type { EffectScope } from 'vue'
import { AppLockRoute } from '@/router/routes/builtin'

export function useAppLock() {
  let lockScope: EffectScope

  const { currentRoute, addRoute, removeRoute } = useAppRouter()

  const appStoreLock = useAppStoreLock()
  const appSetting = useAppStoreSetting()

  watch(
    () => appSetting.getLockStatus,
    (v) => {
      if (v) {
        lockScope = effectScope()
        lockScope.run(() => {
          // dynamic add lock route
          addRoute(AppLockRoute)

          let idleLockScope: EffectScope
          let securityLockScope: EffectScope

          watch(
            () => appSetting.app.lockMode,
            (lockMode) => {
              switch (lockMode) {
                case AppConstLockMode.DEFAULT:
                  securityLockScope?.stop()
                  idleLockScope?.stop()
                  break

                // idle lock mode
                case AppConstLockMode.IDLE:
                  securityLockScope?.stop()

                  idleLockScope = effectScope()
                  idleLockScope.run(() => {
                    let idleSecondsScope: EffectScope

                    watch(
                      () => appSetting.app.lockIdleSeconds,
                      (v) => {
                        if (!v)
                          return

                        idleSecondsScope?.stop()

                        idleSecondsScope = effectScope()

                        idleSecondsScope.run(() => {
                          const { idle: isIdle } = useIdle(
                            appSetting.app.lockIdleSeconds * 1000,
                          )

                          // detect user idle state
                          watch(
                            isIdle,
                            async (v) => {
                              if (v && appSetting.app.lockIdleSeconds !== 0)
                                await appStoreLock.lock(currentRoute)
                            },
                            { immediate: true },
                          )
                        })
                      },
                      { immediate: true },
                    )
                  })
                  break

                // security lock mode
                case AppConstLockMode.SECURITY:
                  idleLockScope?.stop()

                  securityLockScope = effectScope()
                  securityLockScope.run(() => {
                    const { idle: isIdle } = useIdle(15 * 1000)
                    const isVisible = useSharedDocumentVisibility()
                    const isPageLeave = useSharedPageLeave()

                    // in security mode, idle for 15s the app will auto lock
                    watch(
                      isIdle,
                      async (v) => {
                        if (v)
                          await appStoreLock.lock(currentRoute)
                      },
                      { immediate: true },
                    )

                    // detect mouse leave page or not
                    debouncedWatch(
                      isPageLeave,
                      async (v) => {
                        if (v)
                          await appStoreLock.lock(currentRoute)
                      },
                      { debounce: 200, immediate: true },
                    )

                    // detect window visibility
                    watch(
                      isVisible,
                      async (v) => {
                        if (
                          appSetting.app.lockMode
                          === AppConstLockMode.SECURITY
                          && !v
                        ) {
                          await appStoreLock.lock(currentRoute)
                        }
                      },
                      { immediate: true },
                    )
                  })
                  break

                default:
                  break
              }
            },
            {
              immediate: true,
            },
          )
        })
      }
      else {
        appStoreLock.setIsLock(false)
        appStoreLock.setLockRoute({})
        removeRoute(AppLockName)
        lockScope?.stop()
      }
    },
    {
      immediate: true,
    },
  )
}
