export function useTabsContextMenu() {
  const x = ref(0)
  const y = ref(0)

  const ctxMenuShow = ref(false)

  const onOpenCtxMenu = (event: MouseEvent) => {
    // set ctx position
    x.value = event.clientX
    y.value = event.clientY

    ctxMenuShow.value = true
  }
  const onCloseCtxMenu = () => {
    ctxMenuShow.value = false
  }

  return {
    x,
    y,

    ctxMenuShow,
    onOpenCtxMenu,
    onCloseCtxMenu,
  }
}
