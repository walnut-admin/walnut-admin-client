import type { EffectScope } from 'vue'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'

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
          const _storaged_tabs = useAppStorageSync<AppTab[]>(
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
