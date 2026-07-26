<script setup lang="ts">
import AnimatedLogo from '@/components/App/AnimatedLogo/index.vue'

defineOptions({ name: 'WelcomeMessage' })
</script>

<template>
  <div class="flex-col-center h-full flex-1 px-5 text-center">
    <div class="flex-center mb-3.5 h-14 w-14 rounded-2xl">
      <AnimatedLogo :size="56" />
    </div>
    <p class="text-text-primary mb-1.5 text-15px font-600">
      ZhenFly AI 助手
    </p>
    <p class="text-text-placeholder max-w-260px text-xs leading-relaxed">
      我可以帮你查询任务统计、设备状态，生成巡检报告，或回答关于无人机机场的问题。
    </p>
  </div>
</template>
