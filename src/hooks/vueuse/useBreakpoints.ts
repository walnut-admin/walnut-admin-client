import { breakpointsTailwind } from '@vueuse/core'

export function useAppBreakpoints() {
  return useBreakpoints(breakpointsTailwind)
}
