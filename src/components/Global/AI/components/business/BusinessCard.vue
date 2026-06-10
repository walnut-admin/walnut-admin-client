<script setup lang="ts">
defineOptions({ name: 'BusinessCard' })

withDefaults(defineProps<{
  width?: string
  icon?: string
  title?: string
}>(), {
  width: '350px',
})
</script>

<template>
  <div
    class="business-card border-border-light bg-fill-light overflow-hidden border rounded-xl"
    :style="{ width, maxWidth: '100%' }"
  >
    <div v-if="$slots.header || icon || title" class="flex items-center gap-2 px-3.5 pb-2 pt-3">
      <slot name="header">
        <i v-if="icon" class="text-base text-primary" :class="[icon]" />
        <span v-if="title" class="text-text-primary text-13px font-500">{{ title }}</span>
      </slot>
    </div>
    <div>
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-border-lighter border-t px-3.5 py-2.5">
      <slot name="footer" />
    </div>
  </div>
</template>
