export function useAppTextSelection() {
  const state = useTextSelection()

  watchEffect(() => {
    // turbo-console-disable-next-line
    console.log(state.text.value)
  })
}
