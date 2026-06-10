<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'Thinking' })

const props = withDefaults(defineProps<{
  text?: string
  size?: number
}>(), {
  text: 'Generating',
  size: 16,
})

const letters = computed(() => props.text.split(''))

const wrapperStyle = computed(() => {
  const s = props.size * 11.25
  return {
    width: `${s}px`,
    height: `${s}px`,
    fontSize: `${props.size * 1.2}px`,
  }
})
</script>

<template>
  <div
    class="thinking-wrapper relative flex select-none items-center justify-center rounded-full bg-transparent text-white font-300"
    :style="wrapperStyle"
  >
    <span
      v-for="(letter, i) in letters"
      :key="i"
      class="z-1 inline-block animate-[loader-letter-anim_2s_infinite] rounded-[50ch] border-none"
      :style="{ animationDelay: `${i * 0.1}s` }"
    >{{ letter }}</span>
    <div class="absolute left-0 top-0 z-0 aspect-square w-full animate-[loader-rotate_2s_linear_infinite] rounded-full bg-transparent" />
  </div>
</template>

<style>
.thinking-wrapper {
  --think-c1: #fff;
  --think-c2: #ad5fff;
  --think-c3: #471eec;
  --think-c4: #d60a47;
  --think-c5: #311e80;
}

html.dark .thinking-wrapper {
  --think-c1: rgba(255, 255, 255, 0.2);
  --think-c2: #b388ff;
  --think-c3: #7c4dff;
  --think-c4: #ff5252;
  --think-c5: #651fff;
}

@keyframes loader-rotate {
  0% {
    transform: rotate(90deg);
    box-shadow:
      0 10px 20px 0 var(--think-c1) inset,
      0 20px 30px 0 var(--think-c2) inset,
      0 60px 60px 0 var(--think-c3) inset;
  }
  50% {
    transform: rotate(270deg);
    box-shadow:
      0 10px 20px 0 var(--think-c1) inset,
      0 20px 10px 0 var(--think-c4) inset,
      0 40px 60px 0 var(--think-c5) inset;
  }
  100% {
    transform: rotate(450deg);
    box-shadow:
      0 10px 20px 0 var(--think-c1) inset,
      0 20px 30px 0 var(--think-c2) inset,
      0 60px 60px 0 var(--think-c3) inset;
  }
}

@keyframes loader-letter-anim {
  0%, 100% {
    opacity: 0.4;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: scale(1.15);
  }
  40% {
    opacity: 0.7;
    transform: translateY(0);
  }
}
</style>
