<script setup lang="ts">
import BusinessRenderer from '../business/index.vue'
import InterruptedSection from './InterruptedSection.vue'
import MessageBody from './MessageBody.vue'
import MessageToolbox from './MessageToolbox.vue'
import ThinkingSection from './ThinkingSection.vue'

defineOptions({ name: 'MessageRenderer' })

defineProps<{
  msg: IAIMessage
}>()
</script>

<template>
  <BusinessRenderer v-if="msg.businessContent" :business-content="msg.businessContent" :message-id="msg.id" />
  <template v-else-if="msg.interrupted && msg.role === 'assistant'">
    <InterruptedSection
      :msg="msg"
    />
    <MessageToolbox :msg="msg" />
  </template>
  <template v-else>
    <ThinkingSection
      :msg="msg"
    />
    <MessageBody :msg="msg" />
    <MessageToolbox :msg="msg" />
  </template>
</template>
