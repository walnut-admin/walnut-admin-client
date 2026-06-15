interface UseExpireTimerOptions {
  onExpire: () => void | Promise<void>
}

export function useExpireTimer(opts: UseExpireTimerOptions) {
  const { onExpire } = opts

  // Save the timeout ID for easy cancellation
  let timerId: ReturnType<typeof setTimeout> | null = null

  // Clear the current timer
  function stop() {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  /* ---------- The following is the implementation of setLongTimeout ---------- */
  function setLongTimeout(callback: () => void | Promise<void>, delay: number) {
    const MAX_TIMEOUT = 2 ** 31 - 1 // 2147483647

    if (delay <= MAX_TIMEOUT) {
      timerId = setTimeout(callback, delay)
      return
    }

    timerId = setTimeout(() => {
      setLongTimeout(callback, delay - MAX_TIMEOUT)
    }, MAX_TIMEOUT)
  }

  /**
   * Set or refresh the timer
   * @param expireAt Expiration timestamp; pass null to cancel immediately
   */
  function arm(expireAt: number | null) {
    stop()

    if (expireAt === null)
      return

    const now = Date.now()
    const delay = expireAt - now

    if (delay <= 0) {
      // Already expired, trigger asynchronously
      Promise.resolve().then(onExpire)
      return
    }

    // Long timeout implementation
    setLongTimeout(onExpire, delay)
  }

  // Automatically clean up when the component is unmounted
  tryOnUnmounted(stop)

  return { arm, clear: stop }
}
