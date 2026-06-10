<script setup lang="ts">
import { computed } from 'vue'
import { useConversationStore } from '@/components/Global/AI/store/useConversationStore'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'
import { escapeText, splitMarkdown } from '@/components/Global/AI/utils/format'
import MarkdownSegments from './MarkdownSegments.vue'

defineOptions({ name: 'MessageBody' })

const props = defineProps<{
  msg: IAIMessage
}>()

const { isLatestMessage } = useConversationStore()
const { isLoading } = useStreamManager()
const isLatest = computed(() => isLatestMessage(props.msg.id))

const formatCacheKey = computed(() => {
  const content = props.msg.content || ''
  let hash = 5381
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) + hash + content.charCodeAt(i)) | 0
  }
  return `${props.msg.id}:${hash}`
})

const segments = computed(() => {
  if (!props.msg.content)
    return []
  if (isLoading.value && isLatest.value) {
    return [{ type: 'text' as const, html: escapeText(props.msg.content) }]
  }
  return splitMarkdown(
    props.msg.content,
    formatCacheKey.value,
    false,
  )
})
</script>

<template>
  <div
    v-if="segments.length > 0"
    class="bubble border-border-light bg-fill-light text-text-primary max-w-full overflow-x-auto break-words border rounded-xl px-3.5 py-2.5 text-13px leading-relaxed"
  >
    <MarkdownSegments :segments="segments" />
  </div>
  <div v-else-if="isLoading && !msg.thinkingContent" class="bubble typing flex items-center gap-1 px-4 py-3">
    <span class="typing-dot" />
    <span class="typing-dot" />
    <span class="typing-dot" />
  </div>
</template>

<style scoped>
.message-content.user .bubble {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-hover));
  border-color: transparent;
  color: #fff;
}

.bubble {
  overflow-wrap: break-word;
  min-width: 0;
}
.bubble :deep(*:last-child) { margin-bottom: 0; }
.bubble :deep(h1), .bubble :deep(h2), .bubble :deep(h3), .bubble :deep(h4) { margin: 0.5em 0 0.3em; font-weight: 600; color: inherit; }
.bubble :deep(h1) { font-size: 16px; }
.bubble :deep(h2) { font-size: 14px; }
.bubble :deep(h3) { font-size: 13px; }
.bubble :deep(table) { max-width: 100%; display: block; overflow-x: auto; border-collapse: collapse; font-size: 12px; margin: 0.5em 0; }
.bubble :deep(th), .bubble :deep(td) { border: 1px solid var(--divider-color); padding: 4px 8px; text-align: left; }
.bubble :deep(th) { background: var(--action-color); font-weight: 600; }
.bubble :deep(code) { background: var(--action-color); padding: 1px 4px; border-radius: 3px; font-size: 12px; }
.bubble :deep(pre) {
  width: 100%;
  background: var(--action-color); padding: 12px 16px; border-radius: 8px; overflow-x: auto;
  font-size: 12px; margin: 0.5em 0; line-height: 1.6;
}
.bubble :deep(pre code) { background: none; padding: 0; font-size: inherit; white-space: pre; }
.bubble :deep(pre code.hljs) { background: none; padding: 0; }
.bubble :deep(ul), .bubble :deep(ol) { padding-left: 20px; }
.bubble :deep(li) { margin: 0.2em 0; }
.bubble :deep(strong) { font-weight: 600; color: inherit; }
.bubble :deep(hr) { border: none; border-top: 1px solid var(--divider-color); margin: 0.8em 0; }
.bubble :deep(blockquote) { border-left: 3px solid var(--primary-color); margin: 0.5em 0; padding-left: 10px; color: inherit; }
.bubble :deep(a) { color: var(--primary-color); text-decoration: underline; cursor: pointer; }

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-color-3);
  animation: bounce 1.4s infinite ease-in-out;
}
.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>
