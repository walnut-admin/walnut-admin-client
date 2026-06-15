<script setup lang="ts">
import { computed } from 'vue'
import { useChatVirtualList } from '@/components/Global/AI/store/useChatVirtualList'
import { useMessageExpandState } from '@/components/Global/AI/store/useMessageExpandState'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'
import { escapeText } from '@/components/Global/AI/utils/format'
import TextShimmer from '../ui/TextShimmer.vue'

defineOptions({ name: 'ThinkingSection' })

const props = defineProps<{
  msg: IAIMessage
}>()

const { triggerRemeasure } = useChatVirtualList()
const { isLoading } = useStreamManager()
const { toggleThinking, getThinkingExpanded } = useMessageExpandState()
const thinkingExpanded = computed(() => getThinkingExpanded(props.msg.id).value)
</script>

<template>
  <div
    v-if="msg.role === 'assistant' && msg.thinkingContent"
    class="border-border bg-primary-lightest mb-1.5 border rounded-xl px-3.5 py-2.5"
  >
    <div
      class="flex cursor-pointer select-none items-center gap-1 text-12px text-primary font-500"
      @click="() => toggleThinking(msg.id)"
    >
      <span>🧠</span>
      <span v-if="isLoading && !msg.content">
        <TextShimmer as="span" :duration="2">深度思考中…</TextShimmer>
      </span>
      <span v-else>{{ thinkingExpanded ? '已深度思考 (点击折叠)' : '已深度思考 (点击展开)' }}</span>
    </div>
    <Transition name="collapse" @after-enter="triggerRemeasure()" @after-leave="triggerRemeasure()">
      <div
        v-if="(isLoading && !msg.content) || thinkingExpanded"
        class="text-text-placeholder mt-2 whitespace-pre-wrap pt-2 text-12px leading-relaxed"
        v-html="escapeText(msg.thinkingContent || '')"
      />
    </Transition>
  </div>
</template>
