interface UseExpireTimerOptions {
  onExpire: () => void | Promise<void>
}

export function useExpireTimer(opts: UseExpireTimerOptions) {
  const { onExpire } = opts
  // Use ref to store the current timer instance, supporting dynamic replacement
  const timeoutRef = shallowRef<ReturnType<typeof useTimeoutFn> | null>(null)

  // Clear the current timer
  function stop() {
    if (timeoutRef.value) {
      timeoutRef.value.stop()
      timeoutRef.value = null
    }
  }

  /**
   * Set or refresh the timer
   * @param expireAt Timestamp; null means cancel immediately
   */
  function arm(expireAt: number | null) {
    stop() // Clear the old timer first

    if (expireAt === null)
      return

    const ms = expireAt - Date.now()
    if (ms <= 0) {
      // Already expired: keep asynchronous execution
      Promise.resolve(onExpire())
    }
    else {
      // Not expired: create a new timer instance (because start does not support passing parameters)
      timeoutRef.value = useTimeoutFn(
        () => Promise.resolve(onExpire()),
        ms, // Set the correct delay during initialization
        { immediate: true }, // Start immediately
      )
    }
  }

  // Clean up when the component is unmounted
  tryOnUnmounted(stop)

  return { arm, clear: stop }
}
