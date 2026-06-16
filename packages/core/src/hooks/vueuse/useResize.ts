import { useEventListener, useThrottleFn } from '@vueuse/core'

export function useWindowResize(fn: Fn, throttle = 200) {
  const handler = useThrottleFn(fn, throttle)

  useEventListener(window, 'resize', handler)
}
