<script setup lang="ts">
defineOptions({ name: 'AnimatedLogo' })

withDefaults(defineProps<{
  size?: number
}>(), {
  size: 24,
})
</script>

<template>
  <img
    src="/logo.png"
    alt="Logo"
    :style="{ width: `${size}px`, height: `${size}px` }"
    class="rounded object-contain"
  >
</template>
