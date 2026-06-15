export function useScrollWrapper() {
  const userStoreScroll = useAppStoreUserScroll()

  const { currentRoute } = useAppRouter()

  const scrollWrapper = useTemplateRef<HTMLElement>('scrollWrapper')
  const scrollTarget = computed(() => scrollWrapper.value?.querySelector('.w-scrollbar-container') as HTMLDivElement)
  const { x, y, arrivedState, directions } = useScroll(scrollTarget, { behavior: 'smooth', throttle: 250, idle: 1000 })

  const { top: directionTop } = toRefs(directions)

  const { top, bottom } = toRefs(arrivedState)

  debouncedWatch(
    () => [x.value, y.value] as const,
    ([x, y]) => {
      if (currentRoute.value.meta.position)
        userStoreScroll.setScrollPosition(currentRoute.value.name as string, y, x)
    },
    { immediate: true, debounce: 200 },
  )

  watch(
    () => currentRoute.value.meta.position,
    async (v) => {
      if (v) {
        const position = userStoreScroll.getScrollPosition(
          currentRoute.value.name as string,
        )

        const id = setTimeout(() => {
          scrollTarget.value?.scrollTo({
            top: position.top,
            left: position.left,
            behavior: 'smooth',
          })
          clearTimeout(id)
        }, 500)
      }
      else {
        await nextTick(() => {
          scrollTarget.value?.scrollTo({ top: 0, behavior: 'smooth' })
        })
      }
    },
    { immediate: true },
  )

  function onScrollToTop() {
    scrollTarget.value?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return { scrollWrapper, top, bottom, directionTop, y, onScrollToTop }
}
