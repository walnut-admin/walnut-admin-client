<script setup lang="ts">
defineOptions({ name: 'StickyUserBar' })

defineProps<{
  message: { content: string } | null
}>()
</script>

<template>
  <Transition name="slide-in-top">
    <div
      v-if="message"
      class="border-border bg-bg-header sticky z-10 mb-1 border-b px-3 py-2.5 backdrop-blur-[20px] -top-3 -mx-3 -mt-3"
    >
      <div class="flex items-center gap-2">
        <WIcon icon="carbon:user-avatar" width="14" class="text-text-placeholder shrink-0" />
        <span class="text-text-primary min-w-0 flex-1 truncate text-13px font-500">{{ message.content }}</span>
      </div>
    </div>
  </Transition>
</template>
