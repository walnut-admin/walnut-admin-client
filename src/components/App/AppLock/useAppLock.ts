import type { EffectScope } from 'vue'
import { layoutConst } from '@/router/routes/builtin'

export function useAppLock() {
  let lockScope: EffectScope | null = null
  let modeScope: EffectScope | null = null

  const { currentRoute, removeRoute } = useAppRouter()
  const appStoreLock = useAppStoreLock()

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
        () => appStoreLock.getLockIdleSec,
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
      const { idle } = useIdle(appStoreLock.getLockSecuritySec * 1000)
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
        if (!v && appStoreLock.getLockMode === AppConstLockMode.SECURITY)
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
    () => appStoreLock.getEnable,
    (enabled) => {
      if (enabled) {
        lockScope = effectScope()
        lockScope.run(() => {
          appStoreLock.addLockRoute()

          watch(() => appStoreLock.getLockMode, setupLockMode, { immediate: true })
        })
      }
      else {
        appStoreLock.setLocked(false)
        appStoreLock.setLockRoute({})
        removeRoute(layoutConst.lock.name)
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
