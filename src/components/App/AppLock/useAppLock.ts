import type { EffectScope } from 'vue'
import { AppLockRoute } from '@/router/routes/builtin'

export function useAppLock() {
  let lockScope: EffectScope | null = null
  let modeScope: EffectScope | null = null

  const { currentRoute, addRoute, removeRoute } = useAppRouter()
  const appStoreLock = useAppStoreLock()
  const appSetting = useAppStoreSetting()

  function stopMode() {
    modeScope?.stop()
    modeScope = null
  }

  function stopLock() {
    lockScope?.stop()
    lockScope = null
  }

  async function tryLock() {
    try {
      await appStoreLock.lock(currentRoute)
    }
    catch (error) {
      console.log(error)
    }
  }

  function setupIdleMode() {
    modeScope = effectScope()
    modeScope.run(() => {
      watch(
        () => appSetting.app.lockIdleSeconds,
        (seconds) => {
          if (!seconds)
            return

          modeScope = effectScope()
          modeScope.run(() => {
            const { idle } = useIdle(seconds * 1000)

            watch(idle, async (v) => {
              if (v)
                await tryLock()
            })
          })
        },
        { immediate: true, deep: true },
      )
    })
  }

  function setupSecurityMode() {
    modeScope = effectScope()
    modeScope.run(() => {
      const { idle } = useIdle(15 * 1000)
      const isVisible = useDocumentVisibility()
      const isPageLeave = usePageLeave()

      watch(idle, async (v) => {
        if (v)
          await tryLock()
      })

      debouncedWatch(isPageLeave, async (v) => {
        if (v)
          await tryLock()
      }, { debounce: 200 })

      watch(isVisible, async (v) => {
        if (!v && appSetting.app.lockMode === AppConstLockMode.SECURITY)
          await tryLock()
      })
    })
  }

  function setupLockMode(mode: ValueOfAppConstLockMode) {
    stopMode()
    switch (mode) {
      case AppConstLockMode.IDLE:
        setupIdleMode()
        break
      case AppConstLockMode.SECURITY:
        setupSecurityMode()
        break
      default:
        break
    }
  }

  watch(
    () => appSetting.getLockStatus,
    (enabled) => {
      if (enabled) {
        lockScope = effectScope()
        lockScope.run(() => {
          addRoute(AppLockRoute)

          watch(() => appSetting.app.lockMode, setupLockMode, { immediate: true })
        })
      }
      else {
        appStoreLock.setLocked(false)
        appStoreLock.setLockRoute({})
        removeRoute(AppLockName)
        stopMode()
        lockScope?.stop()
        lockScope = null
      }
    },
    { immediate: true },
  )

  tryOnUnmounted(() => {
    stopMode()
    stopLock()
  })
}
