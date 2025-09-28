import type { EffectScope } from 'vue'

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
          if (appSettingScope.getHijackRefresh(currentRoute.value)) {
            useEventListener('keydown', async (e) => {
              if (e.key === 'F5') {
                e.preventDefault()
                toggleLocalRefreshFlag()
              }
            })
          }
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
