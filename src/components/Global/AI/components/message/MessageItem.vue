<script setup lang="ts">
import { computed } from 'vue'
import { useConversationStore } from '@/components/Global/AI/store/useConversationStore'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'
import Thinking from '../ui/Thinking.vue'
import MessageRenderer from './MessageRenderer.vue'

defineOptions({ name: 'MessageItem' })

const props = defineProps<{
  msg: IAIMessage
}>()

const { isLatestMessage } = useConversationStore()
const { isLoading } = useStreamManager()
const isLatest = computed(() => isLatestMessage(props.msg.id))
</script>

<template>
  <Thinking v-if="isLoading && msg.role === 'assistant' && isLatest" :size="2.5" text="" class="shrink-0" />
  <div v-else class="message-avatar flex-center border-border bg-fill text-text-placeholder h-7 w-7 shrink-0 border rounded-lg" :class="msg.role">
    <WIcon v-if="msg.role === 'assistant'" icon="carbon:ai-status" width="14" class="text-primary" />
    <WIcon v-else icon="carbon:user-avatar" width="14" />
  </div>
  <div class="message-content flex flex-col gap-1" :class="msg.role">
    <MessageRenderer
      :msg="msg"
    />
  </div>
</template>

<style scoped>
.message-content {
  max-width: 92%;
}
.message-content.user {
  align-items: flex-end;
}

.message-avatar.assistant {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  border-color: rgba(99, 102, 241, 0.3);
}
</style>
