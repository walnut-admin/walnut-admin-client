export const useSharedPreferredReducedMotion = createSharedComposable(() => {
  const reducedMotion = usePreferredReducedMotion()
  return computed(() => reducedMotion.value === 'reduce')
})
