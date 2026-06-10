<script setup lang="ts">
import { useInterval } from '@vueuse/core'
import { ref, watch } from 'vue'
import { PLACEHOLDER_INTERVAL_MS } from '@/components/Global/AI/config/constants'

defineOptions({ name: 'AnimatedPlaceholder' })

const props = withDefaults(defineProps<{
  active?: boolean
  texts?: string[]
}>(), {
  active: true,
  texts: () => [
    '输入问题，Enter 发送...',
    '试试问：帮我写一份巡检报告',
    '试试问：这个数据异常怎么排查？',
    '试试问：帮我总结一下最近的告警',
  ],
})

const currentIndex = ref(0)
const currentText = ref(props.texts[0])

useInterval(PLACEHOLDER_INTERVAL_MS, {
  controls: true,
  immediate: true,
  callback: () => {
    currentIndex.value = (currentIndex.value + 1) % props.texts.length
  },
})

/**
 * WHAT: Updates displayed placeholder text when carousel index changes
 *
 * Use case: Rotating input placeholder hints every 3 seconds via useInterval callback
 * Side effect: Updates currentText ref, triggering the text transition animation
 */
watch(currentIndex, (idx) => {
  currentText.value = props.texts[idx]
})
</script>

<template>
  <Transition name="placeholder-fade" mode="out-in">
    <span
      v-if="active"
      :key="currentText"
      class="animated-placeholder text-text-placeholder pointer-events-none absolute left-0 top-0 h-full w-full flex select-none items-center overflow-hidden text-ellipsis whitespace-nowrap text-13px leading-relaxed"
    >{{ currentText }}</span>
  </Transition>
</template>

<style scoped>
.animated-placeholder {
  z-index: 0;
  will-change: transform, opacity, filter;
}

.placeholder-fade-enter-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out, filter 0.3s ease-out;
}

.placeholder-fade-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in, filter 0.2s ease-in;
}

.placeholder-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(6px);
}

.placeholder-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  filter: blur(6px);
}
</style>
