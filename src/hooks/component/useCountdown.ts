import { useAppStorageSync } from '@/utils/persistent/storage/sync'

const buttonRetryMapPersistent = useAppStorageSync<Map<string, number>>(AppConstPersistKey.COUNTDOWN, new Map<string, number>())

export function useCountdownStorage({
  persistKey,
  persistSeconds = 60,
  onCountdownComplete,
}: {
  persistKey?: string
  persistSeconds?: number
  onCountdownComplete?: () => void
}) {
  const { t } = useAppI18n()

  const retryText = ref<string>()
  const _leftSeconds = ref<number>(persistSeconds)

  function readStart(): number | undefined {
    return persistKey
      ? buttonRetryMapPersistent.value?.get(persistKey)
      : undefined
  }

  function writeStart(ts: number) {
    if (persistKey) {
      buttonRetryMapPersistent.value?.set(persistKey, ts)
    }
  }

  function clearPersist() {
    if (persistKey) {
      buttonRetryMapPersistent.value?.delete(persistKey)
    }
  }

  const { pause, resume } = useIntervalFn(
    () => {
      retryText.value = t('comp.countdown.label', {
        delay: _leftSeconds.value,
      })

      if (--_leftSeconds.value < 0) {
        pause()
        retryText.value = undefined
        _leftSeconds.value = persistSeconds
        clearPersist()
        onCountdownComplete?.()
      }
    },
    1000,
    { immediate: false, immediateCallback: true },
  )

  function startCountdown() {
    if (persistKey && !readStart()) {
      writeStart(Date.now())
    }
    resume()
  }

  function clear() {
    pause()
    retryText.value = undefined
    _leftSeconds.value = persistSeconds
    clearPersist()
    onCountdownComplete?.()
  }

  onBeforeMount(() => {
    if (!persistKey) {
      _leftSeconds.value = persistSeconds
      return
    }

    const start = readStart()
    if (start) {
      const elapsed = Math.round((Date.now() - start) / 1000)
      _leftSeconds.value = Math.max(persistSeconds - elapsed, 0)

      if (_leftSeconds.value > 0) {
        resume()
      }
      else {
        clearPersist()
        onCountdownComplete?.()
      }
    }
    else {
      _leftSeconds.value = persistSeconds
    }
  })

  return { retryText, pause, resume: startCountdown, clear }
}
