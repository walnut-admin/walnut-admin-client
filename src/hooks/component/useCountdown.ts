import { useAppStorage } from '@/utils/persistent/Storage'
import { StorageSerializers } from '@vueuse/core'

const buttonRetryMapPersistent = useAppStorage<Map<string, number>>(AppConstPersistKey.COUNTDOWN, new Map<string, number>(), { serializer: StorageSerializers.map })

export function useCountdown({ persistKey, persistSeconds = 60, onCountdownComplete }: { persistKey?: string, persistSeconds?: number, onCountdownComplete?: () => void }) {
  const { t } = useAppI18n()

  const retryText = ref<string>()
  const _intervalSeconds = ref<number>(persistSeconds)

  const getPersistSeconds = computed<number>({
    get() {
      if (persistKey) {
        return buttonRetryMapPersistent.value.get(persistKey)!
      }
      return _intervalSeconds.value!
    },
    set(newValue) {
      if (persistKey) {
        buttonRetryMapPersistent.value.set(persistKey, newValue ?? persistSeconds)
      }
      else {
        _intervalSeconds.value = newValue
      }
    },
  })

  const { pause, resume } = useIntervalFn(() => {
    retryText.value = t('comp.countdown.label', {
      delay: getPersistSeconds.value,
    })

    --getPersistSeconds.value!

    if (getPersistSeconds.value! < 0) {
      pause()

      retryText.value = undefined

      if (persistKey) {
        buttonRetryMapPersistent.value.set(persistKey, persistSeconds)
      }
      else {
        _intervalSeconds.value = persistSeconds
      }

      if (onCountdownComplete) {
        onCountdownComplete()
      }
    }
  }, 1000, { immediate: false, immediateCallback: true })

  // init
  onBeforeMount(() => {
    if (persistKey) {
      if (getPersistSeconds.value) {
        if (getPersistSeconds.value !== persistSeconds) {
          resume()
        }
      }
      else {
        buttonRetryMapPersistent.value.set(persistKey, persistSeconds)
      }
    }
  })

  return {
    retryText,
    pause,
    resume,
  }
}
