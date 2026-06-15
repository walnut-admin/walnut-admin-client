export function useDraggableElement(refString: string) {
  const el = useTemplateRef<HTMLElement>(refString)
  const myX = ref()
  const myY = ref()

  const { width, height } = useWindowSize()

  const { style, x, y } = useDraggable(el, {
    initialValue: { x: width.value - 100, y: height.value - 100 },
    preventDefault: true,
    stopPropagation: true,
    onMove: (p) => {
      myX.value = p.x
      myY.value = p.y
    },
  })

  watchEffect(() => {
    x.value = myX.value ?? width.value - 100
    y.value = myY.value ?? height.value - 100
  })

  return {
    el,
    style,
  }
}
