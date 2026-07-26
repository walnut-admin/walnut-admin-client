<script setup lang="ts">
defineProps<{
  type: string
  payload: Record<string, any>
}>()
</script>

<template>
  <div class="border border-gray-300 rounded-lg border-dashed p-4 text-center dark:border-gray-600">
    <div class="text-13px text-gray-400">
      Business type "<span class="text-primary font-mono">{{ type }}</span>" not yet implemented
    </div>
    <div class="mt-1 text-11px text-gray-300 dark:text-gray-500">
      Add component to CARD_COMPONENT_MAP in config/business/componentRegistry.ts
    </div>
  </div>
</template>
