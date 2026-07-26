<script lang="ts" setup>
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'WCompExtraTextScrollHorizontal',
})

const props = withDefaults(defineProps<HorizontalProps>(), { speed: 10000, maxLength: 8 })

interface HorizontalProps {
  texts?: string[]
  speed?: number
  maxLength?: number
}

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef')

const durationRef = ref(5)
const wrapperWidthRef = ref(500)
const contentWidthRef = ref(500)

const getWrapperStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  left: `${wrapperWidthRef.value}px`,
  animation: `text_scroll_horizontal ${durationRef.value}s linear infinite`,
  animationPlayState: 'running',
  animationFillMode: 'forwards',
}))

const getTranslateX = computed(() => `translateX(-${contentWidthRef.value}px)`)

watchEffect(() => {
  if (!containerRef.value || !wrapperRef.value)
    return

  let contentWidth = 0
  const containerWidth = containerRef.value.clientWidth

  const children = wrapperRef.value.children

  if (children.length === 1) {
    contentWidth = children[0].scrollWidth + containerWidth
  }
  else {
    for (let i = 0; i < children.length!; i++) {
      contentWidth += children[i].scrollWidth
      contentWidth += containerWidth
    }
  }

  contentWidth = contentWidth === 0 ? 500 : contentWidth

  const duration = (props.speed! * props.texts!.length) / 1000

  durationRef.value = duration
  wrapperWidthRef.value = containerWidth
  contentWidthRef.value = contentWidth
})
</script>

<template>
  <div v-if="texts?.some(i => i.length < maxLength)" class="truncate whitespace-nowrap">
    {{ texts[0] }}
  </div>
  <div
    v-else
    ref="containerRef"
    class="flex items-center overflow-hidden whitespace-nowrap break-all"
  >
    <div
      ref="wrapperRef"
      :style="getWrapperStyle"
      class="!hover:animate-paused !hover:cursor-default"
    >
      <span
        v-for="(item, index) in texts"
        :key="index"
        class="inline-block"
        :style="{ marginRight: `${wrapperWidthRef}px` }"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<style>
@keyframes text_scroll_horizontal {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: v-bind(getTranslateX);
  }
}
</style>
