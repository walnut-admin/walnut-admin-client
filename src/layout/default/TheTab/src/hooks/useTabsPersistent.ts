import type { EffectScope } from 'vue'
import { useAppStorage2 } from '@/utils/persistent/storage2'

export function useTabsPersistent() {
  let scope: EffectScope

  const appTab = useAppStoreTab()
  const appSetting = useAppStoreSetting()

  watch(
    () => appSetting.tabs.persistent,
    (v) => {
      if (v) {
        scope = effectScope()

        scope.run(() => {
          const _storaged_tabs = useAppStorage2<AppTab[]>(
            AppConstPersistKey.TABS,
            appTab.tabs,
          )

          watch(
            () => appTab.tabs,
            (v) => {
              _storaged_tabs.value = v
            },
            {
              deep: true,
            },
          )

          tryOnMounted(() => {
            if (_storaged_tabs.value?.length)
              appTab.tabs = _storaged_tabs.value
          })

          onScopeDispose(() => {
            const key = Object.keys(localStorage).find(i =>
              i.includes(AppConstPersistKey.TABS),
            )

            key && localStorage.removeItem(key)
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
