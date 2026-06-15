/**
 * @description wrapper for `useManualRefHistory` function
 * @link https://vueuse.org/core/usemanualrefhistory/#usemanualrefhistory
 */
export function useState<T>(state: T) {
  const insideState = ref<T>(state) as Ref<T>

  const { reset, commit, history, clear } = useManualRefHistory<T>(insideState, {
    clone: true,
  })

  return {
    stateRef: insideState,
    resetState: () => reset(),
    commit,
    history,
    clear,
  }
}
