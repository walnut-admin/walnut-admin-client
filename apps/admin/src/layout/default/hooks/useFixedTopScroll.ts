import type { EffectScope } from 'vue'

export function useFixedTopScroll(
  refString: string,
  { fixed: _fixed, scrollUpShow: _scrollUpShow, liveOnHover: _liveOnHover }: { fixed: Ref<boolean>, scrollUpShow: Ref<boolean>, liveOnHover: Ref<boolean> },
  { top, y, directionTop }: { top: Ref<boolean>, y: Ref<number>, directionTop: Ref<boolean> },
) {
  const targetShow = ref(true)
  const targetRef = useTemplateRef<HTMLElement>(refString)

  let fixedScope: EffectScope | null

  watch(
    () => _fixed.value,
    (fixed) => {
      fixedScope?.stop()
      fixedScope = null

      if (!fixed) {
        fixedScope = effectScope()
        fixedScope.run(() => setupScrollUpShowLogic())
      }
    },
    { immediate: true },
  )

  function setupScrollUpShowLogic() {
    let upShowScope: EffectScope | null
    let childScopeDisposer: (() => void) | undefined

    const dispose = () => {
      childScopeDisposer?.()
      childScopeDisposer = undefined
      upShowScope?.stop()
      upShowScope = null
    }

    const unwatch = watch(
      () => _scrollUpShow.value,
      (scrollUpShow) => {
        dispose()

        if (scrollUpShow) {
          upShowScope = effectScope()
          childScopeDisposer = upShowScope.run(() => setupTopLogic())
        }
      },
      { immediate: true },
    )

    onScopeDispose(() => {
      unwatch()
      dispose()
    })

    return dispose
  }

  function setupTopLogic() {
    let topScope: EffectScope | null
    let childScopeDisposer: (() => void) | undefined

    const dispose = () => {
      childScopeDisposer?.()
      childScopeDisposer = undefined
      topScope?.stop()
      topScope = null
    }

    const unwatch = watch(
      () => top.value,
      (isTop) => {
        dispose()

        if (!isTop) {
          topScope = effectScope()
          childScopeDisposer = topScope.run(() => setupLiveOnHoverLogic())
        }
      },
      { immediate: true },
    )

    onScopeDispose(() => {
      unwatch()
      dispose()
    })

    return dispose
  }

  function setupLiveOnHoverLogic() {
    let liveOnHoverScope: EffectScope | null
    let scrollScope: EffectScope | null
    let intervalControls: { pause: () => void, resume: () => void } | null
    let yWatchStop: (() => void) | null
    let mouseWatchStop: (() => void) | null

    const dispose = () => {
      intervalControls?.pause()
      intervalControls = null

      yWatchStop?.()
      yWatchStop = null
      mouseWatchStop?.()
      mouseWatchStop = null

      liveOnHoverScope?.stop()
      liveOnHoverScope = null
      scrollScope?.stop()
      scrollScope = null
    }

    const unwatch = watch(
      () => _liveOnHover.value,
      (liveOnHover) => {
        // 清理现有副作用
        dispose()

        if (liveOnHover) {
          liveOnHoverScope = effectScope()
          liveOnHoverScope.run(() => {
            intervalControls = useIntervalFn(() => {
              targetShow.value = false
            }, 2000)

            yWatchStop = watch(
              () => y.value,
              () => {
                if (directionTop.value) {
                  targetShow.value = true
                  intervalControls?.resume()
                }
              },
              { immediate: true },
            )

            const { isOutside } = useMouseInElement(targetRef)
            mouseWatchStop = watch(
              () => isOutside.value,
              outside => (outside ? intervalControls?.resume() : intervalControls?.pause()),
              { immediate: true },
            )

            onScopeDispose(dispose)
          })
        }
        else {
          scrollScope = effectScope()
          scrollScope.run(() => {
            intervalControls = useIntervalFn(() => {
              targetShow.value = false
            }, 2000)

            yWatchStop = watch(
              () => y.value,
              () => {
                if (directionTop.value) {
                  targetShow.value = true
                  intervalControls?.resume()
                }
              },
              { immediate: true },
            )

            onScopeDispose(dispose)
          })
        }
      },
      { immediate: true },
    )

    onScopeDispose(() => {
      unwatch()
      dispose()
    })

    return dispose
  }

  return { targetRef, targetShow }
}
