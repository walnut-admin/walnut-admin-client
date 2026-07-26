<script setup lang="ts">
defineOptions({ name: 'ScrollToBottom' })

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <Transition name="fade">
    <button
      v-if="visible"
      class="flex-center border-border bg-bg text-text-secondary hover:bg-fill-lighter hover:text-text-primary absolute bottom-3 right-3 z-10 h-8 w-8 cursor-pointer border rounded-full shadow-md transition-all duration-200 hover:translate-y--1px hover:shadow-lg"
      title="滚动到当前"
      @click="emit('click')"
    >
      <WIcon icon="carbon:chevron-down" width="14" />
    </button>
  </Transition>
</template>
