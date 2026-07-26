<script lang="ts" setup>
defineOptions({
  name: 'WCompExtraTextScrollVertical',
})

const props = withDefaults(defineProps<VerticalProps>(), { lineHeight: 24, speed: 6000, maxLength: 8 })

interface VerticalProps {
  texts?: string[]
  speed?: number
  maxLength?: number
  lineHeight?: number
}

let timer = 0
let innerTimer = 0
let time = 1
let position = 0

const positionRef = ref(0)
const wrapperRef = useTemplateRef('wrapperRef')
const isHovered = useElementHover(wrapperRef)

const total = computed(() => props.texts!.length)

// TODO first item missing

function tick() {
  if (
    (time % (Math.round((props.speed / 1000) * 60))) === 0
    && !isHovered.value
  ) {
    cancelAnimationFrame(innerTimer)
    innerTimer = requestAnimationFrame(scroll)
    time = 0
  }
  time++

  if (isHovered.value)
    time = 0

  cancelAnimationFrame(timer)
  timer = requestAnimationFrame(tick)
}

function scroll() {
  if (position % props.lineHeight !== 0) {
    positionRef.value = position + 1
    if (position > (total.value - 1) * props.lineHeight)
      position = 0

    cancelAnimationFrame(innerTimer)
    innerTimer = requestAnimationFrame(scroll)
  }
  else {
    cancelAnimationFrame(innerTimer)
  }
  position++
}

onBeforeMount(() => {
  cancelAnimationFrame(innerTimer)
  timer = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(timer)
})
</script>

<template>
  <div v-if="texts?.some(i => i.length < maxLength)" class="truncate whitespace-nowrap">
    {{ texts[0] }}
  </div>
  <div v-else ref="wrapperRef" class="flex content-start items-center">
    <div class="h-full w-full cursor-default overflow-hidden">
      <div class="relative w-full" :style="{ top: `-${positionRef}px` }">
        <div
          v-for="(item, index) in texts"
          :key="index"
          :title="item"
          :style="{ lineHeight: `${lineHeight}px` }"
          class="cursor-default overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
