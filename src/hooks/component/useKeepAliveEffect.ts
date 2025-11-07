import type { Fn, PromiseFn } from 'easy-fns-ts'

const { currentRoute } = useAppRouter()

export function useKeepAliveEffect(callback: Fn | PromiseFn) {
  let isInitialLoad = true

  // handle initial load (both normal and KeepAlive components)
  onMounted(async () => {
    console.log('useKeepAliveEffect: component mounted')
    await callback()
  })

  // handle KeepAlive cache activation (skip first activation as it will trigger onMounted)
  onActivated(async () => {
    if (isInitialLoad) {
      isInitialLoad = false // first activation is handled in onMounted
      return
    }

    console.log('useKeepAliveEffect: activated from cache')
    if (currentRoute.value?.meta?.cache) {
      console.log('useKeepAliveEffect: skipped due to cache meta')
      return
    }

    await callback()
  })
}
