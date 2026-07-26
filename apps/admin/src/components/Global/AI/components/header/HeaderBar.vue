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
  height: 1.75rem;
  width: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--body-color);
  color: var(--text-color-2);
  transition: all 150ms;
}
.ai-header-btn:hover {
  border-color: var(--divider-color);
  background-color: var(--base-color);
  color: var(--text-color-1);
}
</style>
