<script setup lang="ts">
import { computed } from 'vue'
import { ACTION_HANDLER_MAP } from '../../config/business/actionRegistry'
import { CARD_COMPONENT_MAP } from '../../config/business/componentRegistry'
import { useConversationStore } from '../../store/useConversationStore'

defineOptions({ name: 'BusinessRenderer' })

const props = defineProps<{
  businessContent: IAIBusinessContent
  messageId: string
}>()

const { patchLastAssistantMessage } = useConversationStore()

const cardComponent = computed(() => {
  if (props.businessContent.category === 'card') {
    return CARD_COMPONENT_MAP[props.businessContent.type as keyof CardPayloadMap]
  }
  return null
})

// Action 类型 — 立即执行
if (props.businessContent.category === 'action') {
  const handler = ACTION_HANDLER_MAP[props.businessContent.type as keyof ActionPayloadMap]
  if (handler) {
    Promise.resolve(handler(props.businessContent as any)).then(() => {
      patchLastAssistantMessage({ businessContent: undefined })
    })
  }
}
</script>

<template>
  <component
    :is="cardComponent"
    v-if="businessContent.category === 'card' && cardComponent"
    :type="businessContent.type"
    :payload="businessContent"
    :message-id="messageId"
  />
  <div v-else-if="businessContent.category === 'card' && !cardComponent" class="p-2 text-12px text-gray-400">
    No component registered for type "{{ businessContent.type }}"
  </div>
</template>
