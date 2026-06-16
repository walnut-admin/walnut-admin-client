import type { EffectScope } from 'vue'
import { toggleLocalRefreshFlag } from '@walnut/core/hooks/core/useLocalRefresh'

export function useAppHijackF5() {
  let scope: EffectScope

  const appSettingScope = useAppStoreSettingScope()
  const { currentRoute } = useAppRouter()

  watch(
    () => appSettingScope.getHijackRefreshStatus,
    (v) => {
      if (v) {
        scope = effectScope()
        scope.run(() => {
          useEventListener('keydown', async (e) => {
            if (appSettingScope.getHijackRefresh(currentRoute.value) && e.key === 'F5') {
              e.preventDefault()
              toggleLocalRefreshFlag()
            }
          })
        })
      }
      else {
        scope?.stop()
      }
    },
    {
      immediate: true,
    },
  )
}
