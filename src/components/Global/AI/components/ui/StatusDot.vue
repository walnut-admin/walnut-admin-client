<script setup lang="ts">
defineOptions({ name: 'StatusDot' })

withDefaults(defineProps<{
  color?: string
  pulse?: boolean
}>(), {
  color: 'var(--success-color)',
})
</script>

<template>
  <span
    class="inline-block h-2 w-2 shrink-0 rounded-full"
    :class="{ 'animate-pulse-dot': pulse }"
    :style="{
      background: color,
      boxShadow: `0 0 6px ${color}`,
    }"
  />
</template>

<style scoped>
.animate-pulse-dot {
  animation: pulse-dot 1.2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
