const isReducedMotion = useSharedPreferredReducedMotion()

const useSharedDark = createSharedComposable(() => {
  return useDark({
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: AppConstPersistKey.DARK_MODE,
    disableTransition: isReducedMotion.value,
  })
})

export const isDark = useSharedDark()

// https://github.com/unocss/unocss/blob/ac1253b910fb0f0f09ace3733c972c09659ddf0f/playground/src/composables/dark.ts
export function toggleDark(e: MouseEvent) {
  // @ts-expect-error: Transition API
  const isAppearanceTransition = document.startViewTransition && !isReducedMotion.value

  if (!isAppearanceTransition || !e) {
    isDark.value = !isDark.value
    return
  }

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })

  const target = e.target as HTMLElement
  const { left, top, width, height } = target.getBoundingClientRect()
  const x = left + width / 2
  const y = top + height / 2
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  const ratioX = (100 * x) / innerWidth
  const ratioY = (100 * y) / innerHeight
  const referR = Math.hypot(innerWidth, innerHeight) / Math.SQRT2
  const ratioR = (100 * endRadius) / referR

  transition.ready.then(() => {
    const clipPath = [
      `circle(0% at ${ratioX}% ${ratioY}%)`,
      `circle(${ratioR}% at ${ratioX}% ${ratioY}%)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value
          ? [...clipPath].reverse()
          : clipPath,
      },
      {
        duration: 500,
        fill: 'both',
        easing: 'ease-in-out',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
