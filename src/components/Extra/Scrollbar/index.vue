<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'
import type { ScrollbarInst } from 'naive-ui'
import type { ICompExtraScrollbarInst, ICompExtraScrollbarProps } from '.'

defineOptions({
  name: 'WCompExtraScrollbar',
})

const {
  height = '0',
  width = '100%',
  behavior = 'smooth',
  scrollbar = true,
  xScrollable = false,
  hijackXScrollbar = true,
  xStep = 250,
} = defineProps<ICompExtraScrollbarProps>()

const emits = defineEmits<{ scroll: [] }>()
const value = defineModel<number>('value', { default: 0 })

const userStorePreference = useAppStoreUserPreference()

const getBehavior = computed(() =>
  userStorePreference.getReducedMotion ? 'instant' : behavior,
)

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef')
const scrollRef = useTemplateRef<ScrollbarInst & { scrollbarInstRef: Recordable }>('scrollRef')
const isHovered = useElementHover(wrapperRef)

function onScroll(e: Event) {
  value.value = Number((e.target as HTMLElement)[xScrollable ? 'scrollLeft' : 'scrollTop'].toFixed(2))

  emits('scroll')
}

function onInitXScrollHijack() {
  if (!xScrollable)
    return

  if (!hijackXScrollbar)
    return

  useEventListener(wrapperRef, 'wheel', (e: WheelEvent) => {
    if (!isHovered.value)
      return

    e.preventDefault()

    const node = scrollRef.value?.scrollbarInstRef?.containerRef

    if (e.deltaY > 0) {
      scrollRef.value!.scrollTo({
        left: node.scrollLeft + xStep,
        behavior: 'instant',
      })
    }
    else {
      scrollRef.value!.scrollTo({
        left: node.scrollLeft - xStep,
        behavior: 'instant',
      })
    }

    onScroll(e)
  })
}

function onInitScrollbar() {
  if (!scrollbar) {
    const target = wrapperRef.value?.querySelector(
      `.w-scrollbar-rail--${
        xScrollable ? 'vertical' : 'horizontal'
      }`,
    ) as HTMLElement

    if (target) {
      target.style.display = 'none'
    }
  }
}

defineExpose<ICompExtraScrollbarInst>({
  scrollTo: (opt) => {
    scrollRef.value!.scrollTo({
      ...(opt as object),
      behavior: getBehavior.value,
    })
  },

  scrollToStart: () => {
    scrollRef.value!.scrollTo({
      top: 0,
      behavior: getBehavior.value,
    })
  },

  scrollToEnd: () => {
    const target = scrollRef.value!.scrollbarInstRef.containerRef

    scrollRef.value!.scrollTo(
      xScrollable
        ? {
            left: target?.scrollWidth,
            behavior: getBehavior.value,
          }
        : {
            top: target?.scrollHeight,
            behavior: getBehavior.value,
          },
    )
  },

  scrollToIndex: (index) => {
    if (index < 0)
      return

    // TODO optimise below
    const node = scrollRef.value?.scrollbarInstRef?.containerRef?.children[0]
      ?.children[index]
      ?? scrollRef.value?.scrollbarInstRef?.containerRef?.children[0]
        ?.children[0]
        ?.children[index]

    scrollRef.value!.scrollTo(
      xScrollable
        ? {
            left: node.offsetLeft,
            behavior: getBehavior.value,
          }
        : {
            top: node.offsetTop,
            behavior: getBehavior.value,
          },
    )
  },

  getIsOverflow: () => {
    if (xScrollable) {
      return (
        scrollRef.value!.scrollbarInstRef.containerRef.scrollWidth
        > scrollRef.value!.scrollbarInstRef.containerRef.clientWidth
      )
    }
    else {
      return (
        scrollRef.value!.scrollbarInstRef.containerRef.scrollHeight
        > scrollRef.value!.scrollbarInstRef.containerRef.clientHeight
      )
    }
  },
})

onMounted(() => {
  onInitXScrollHijack()
  onInitScrollbar()
})
</script>

<template>
  <div ref="wrapperRef" class="h-full w-full">
    <n-scrollbar
      ref="scrollRef"
      :container-style="{
        height,
        width,
      }"
      :x-scrollable="xScrollable"
      @scroll="onScroll"
    >
      <slot />
    </n-scrollbar>
  </div>
</template>
