<script setup lang="ts">
import type { MarkdownSegment } from '@/components/Global/AI/utils/format'
import CodeBlock from './CodeBlock.vue'

defineOptions({ name: 'MarkdownSegments' })

defineProps<{
  segments: MarkdownSegment[]
}>()
</script>

<template>
  <template v-for="(seg, i) in segments" :key="i">
    <div v-if="seg.type === 'text'" v-html="seg.html" />
    <CodeBlock
      v-else
      :language="seg.language"
      :code="seg.code"
    />
  </template>
</template>
