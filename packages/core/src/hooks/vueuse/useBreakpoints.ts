import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useAppBreakpoints() {
  return useBreakpoints(breakpointsTailwind)
}
