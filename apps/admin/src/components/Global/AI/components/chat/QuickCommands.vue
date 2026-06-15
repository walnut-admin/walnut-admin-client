<script setup lang="ts">
import { QUICK_COMMANDS as quickCommands } from '@/components/Global/AI/config/quickCommands'
import { useChatSend } from '@/components/Global/AI/store/useChatSend'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'

defineOptions({ name: 'QuickCommands' })

const { isLoading } = useStreamManager()
const { handleQuickCommand } = useChatSend()
</script>

<template>
  <div class="quick-commands border-border bg-fill flex shrink-0 gap-1.5 overflow-x-auto border-b px-2 py-2.5">
    <button
      v-for="cmd in quickCommands"
      :key="cmd.label"
      class="quick-cmd-btn rounded-4xl border-border bg-fill text-text-regular hover:bg-fill-light flex cursor-pointer items-center gap-1.5 whitespace-nowrap border px-2.5 py-1.5 text-11px transition-all duration-150 disabled:cursor-not-allowed hover:border-primary hover:text-primary disabled:opacity-50"
      :disabled="isLoading"
      @click="handleQuickCommand(cmd.query)"
    >
      <WIcon :icon="cmd.icon" width="12" />
      <span>{{ cmd.label }}</span>
    </button>
  </div>
</template>
