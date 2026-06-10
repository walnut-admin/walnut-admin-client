<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'TextShimmer' })

const props = withDefaults(defineProps<{
  as?: string
  duration?: number
  spread?: number
  delay?: number
}>(), {
  as: 'p',
  duration: 2,
  spread: 100,
  delay: 0,
})

const shimmerStyle = computed(() => ({
  '--an-shimmer-duration': `${props.duration}s`,
  '--an-shimmer-spread': `${props.spread}px`,
  'animationDelay': props.delay > 0 ? `${props.delay}s` : undefined,
  'animationDuration': `${props.duration}s`,
  'animationIterationCount': 'infinite',
  'animationTimingFunction': 'linear',
}))
</script>

<template>
  <component
    :is="as"
    class="an-text-shimmer an-text-shimmer--active"
    :style="shimmerStyle"
  >
    <slot />
  </component>
</template>

<style scoped>
@keyframes an-shimmer {
  from {
    background-position: 100% center;
  }
  to {
    background-position: 0% center;
  }
}

.an-text-shimmer {
  display: inline-block;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(
    90deg,
    var(--an-foreground-subtle, #a3a3a3) 0%,
    var(--an-foreground-subtle, #a3a3a3) 40%,
    var(--an-foreground-muted, #737373) 50%,
    var(--an-foreground-subtle, #a3a3a3) 60%,
    var(--an-foreground-subtle, #a3a3a3) 100%
  );
  background-repeat: no-repeat;
}

.an-text-shimmer--active {
  animation: an-shimmer var(--an-shimmer-duration, 2s) linear infinite;
}
</style>
