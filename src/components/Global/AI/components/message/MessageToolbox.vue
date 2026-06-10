<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'
import { useConversationStore } from '@/components/Global/AI/store/useConversationStore'
import { useMessageHover } from '@/components/Global/AI/store/useMessageHover'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'
import { formatTime } from '@/components/Global/AI/utils/format'
import { useAppConfirm } from '@/hooks/component/useConfirm'

defineOptions({ name: 'MessageToolbox' })

const props = defineProps<{
  msg: IAIMessage
}>()

const { copy, copied } = useClipboard({ legacy: true })

const { isLatestMessage, deleteMessage, currentId } = useConversationStore()
const { isLoading } = useStreamManager()
const { isHovered } = useMessageHover()
const isLatest = computed(() => isLatestMessage(props.msg.id))
const hovered = computed(() => isHovered(props.msg.id))

function copyMessage(msg: IAIMessage) {
  copy(msg.content || '')
}

function deleteMessageWithConfirm(msg: IAIMessage) {
  useAppConfirm('确定删除该消息吗？').then(({ confirmed }) => {
    if (confirmed) {
      deleteMessage(currentId.value, msg.id)
    }
  })
}
</script>

<template>
  <div class="mt-1 flex items-center gap-1">
    <span class="message-time text-text-placeholder px-1 text-10px">{{ formatTime(msg.timestamp) }}</span>
    <Transition name="fade">
      <div
        v-if="hovered && !!msg.content && !(isLoading && isLatest && msg.role === 'assistant')"
        class="flex items-center gap-1"
      >
        <button
          class="flex-center bg-bg cursor-pointer rounded transition-all duration-150"
          :class="copied ? 'text-primary' : 'text-info hover:text-primary'"
          title="复制"
          @click="copyMessage(msg)"
        >
          <WIcon v-if="copied" icon="carbon:checkmark" width="14" />
          <WIcon v-else icon="carbon:copy" width="14" />
        </button>
        <button class="flex-center bg-bg hover:border-danger hover:text-danger cursor-pointer rounded text-info transition-all duration-150" title="删除" @click="deleteMessageWithConfirm(msg)">
          <WIcon icon="carbon:trash-can" width="14" />
        </button>
      </div>
    </Transition>
  </div>
</template>
