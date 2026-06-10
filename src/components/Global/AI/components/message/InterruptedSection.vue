<script setup lang="ts">
import { computed } from 'vue'
import { useChatVirtualList } from '@/components/Global/AI/store/useChatVirtualList'
import { useMessageExpandState } from '@/components/Global/AI/store/useMessageExpandState'
import { escapeText, splitMarkdown } from '@/components/Global/AI/utils/format'
import MarkdownSegments from './MarkdownSegments.vue'

defineOptions({ name: 'InterruptedSection' })

const props = defineProps<{
  msg: IAIMessage
}>()

const { triggerRemeasure } = useChatVirtualList()
const { getInterruptedExpanded, toggleInterrupted } = useMessageExpandState()
const expanded = computed(() => getInterruptedExpanded(props.msg.id).value)

const segments = computed(() => {
  if (!props.msg.content)
    return []
  return splitMarkdown(props.msg.content, `interrupted-${props.msg.id}`)
})
</script>

<template>
  <div class="bg-fill-light mb-1.5 rounded-xl px-3.5 py-2.5">
    <div
      class="flex cursor-pointer select-none items-center gap-1 text-12px text-warning font-500"
      @click="toggleInterrupted(msg.id)"
    >
      <span>⚠</span>
      <span>{{ expanded ? '输出已中断 (点击折叠)' : '输出已中断 (点击展开)' }}</span>
    </div>
    <Transition name="collapse" @after-enter="triggerRemeasure()" @after-leave="triggerRemeasure()">
      <div v-if="expanded && (msg.thinkingContent || segments.length > 0)" class="mt-2 flex flex-col gap-2">
        <div
          v-if="msg.thinkingContent"
          class="bg-fill text-text-placeholder whitespace-pre-wrap rounded-lg px-3 py-2.5 text-12px leading-relaxed"
          v-html="escapeText(msg.thinkingContent)"
        />
        <div
          v-if="segments.length > 0"
          class="bg-fill text-text-primary rounded-lg px-3.5 py-2.5 text-13px leading-relaxed"
        >
          <MarkdownSegments :segments="segments" />
        </div>
      </div>
    </Transition>
  </div>
</template>
