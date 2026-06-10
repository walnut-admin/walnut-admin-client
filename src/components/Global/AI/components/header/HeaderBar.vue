<script setup lang="ts">
import HeaderActions from './HeaderActions.vue'
import HeaderLeft from './HeaderLeft.vue'

defineOptions({ name: 'AiHeader' })
</script>

<template>
  <div class="flex-between border-border bg-fill-light shrink-0 border-b px-4 py-3">
    <HeaderLeft />
    <HeaderActions />
  </div>
</template>

<style>
.ai-header-btn {
  @apply h-7 w-7 flex-center cursor-pointer border border-border rounded-md bg-fill text-text-regular transition-all duration-150;
}
.ai-header-btn:hover {
  @apply border-border-light bg-fill-lighter text-text-primary;
}
</style>
