import type { Fn, PromiseFn } from 'easy-fns-ts'

export function useKeepAliveEffect(callback: Fn | PromiseFn) {
  let mounted = false
  let firstActivated = true

  onMounted(async () => {
    if (!mounted) {
      mounted = true
      console.log('useKeepAliveEffect mounted')
      await callback()
    }
  })

  onActivated(async () => {
    if (mounted) {
      if (firstActivated) {
        firstActivated = false
        return
      }
      console.log('useKeepAliveEffect activated')
      await callback()
    }
  })
}
