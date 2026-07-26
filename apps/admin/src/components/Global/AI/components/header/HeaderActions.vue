<script setup lang="ts">
import { computed } from 'vue'
import { useAIPreferences } from '@/components/Global/AI/store/useAIPreferences'
import { useConversationHistory } from '@/components/Global/AI/store/useConversationHistory'
import { usePanelState } from '@/components/Global/AI/store/usePanelState'
import DragHandle from './DragHandle.vue'
import HistoryPopover from './HistoryPopover.vue'

defineOptions({ name: 'HeaderActions' })

const aiPrefs = useAIPreferences()
const { close, cyclePanelMode, isContentAside } = usePanelState()
const { closeHistoryPopover } = useConversationHistory()

const toggleIcon = computed(() => {
  switch (aiPrefs.value.panelMode) {
    case 'panel': return 'carbon:maximize'
    case 'large-panel': return 'carbon:open-panel-filled-right'
    default: return 'carbon:minimize'
  }
})

const toggleTitle = computed(() => {
  switch (aiPrefs.value.panelMode) {
    case 'panel': return '放大面板'
    case 'large-panel': return '固定到侧边'
    default: return '切换到浮动面板'
  }
})
</script>

<template>
  <div class="flex gap-1.5">
    <DragHandle
      v-if="!isContentAside"
      class="header-btn-anim"
      style="animation-delay: 0ms"
      @dragstart="closeHistoryPopover()"
    />

    <button
      v-if="isContentAside"
      class="ai-header-btn header-btn-anim"
      style="animation-delay: 0ms"
      :title="aiPrefs.asidePinned ? '取消固定' : '固定面板'"
      @click="aiPrefs.asidePinned = !aiPrefs.asidePinned"
    >
      <WIcon :icon="aiPrefs.asidePinned ? 'carbon:pin-filled' : 'carbon:pin'" width="14" />
    </button>

    <button
      class="ai-header-btn header-btn-anim"
      style="animation-delay: 100ms"
      :title="toggleTitle"
      @click="cyclePanelMode()"
    >
      <WIcon :icon="toggleIcon" width="14" />
    </button>

    <HistoryPopover />

    <button
      v-if="!isContentAside || (isContentAside && !aiPrefs.asidePinned)"
      class="ai-header-btn header-btn-anim"
      style="animation-delay: 300ms"
      title="收起面板"
      @click="close()"
    >
      <WIcon icon="carbon:chevron-down" width="14" />
    </button>
  </div>
</template>

<style>
@keyframes header-btn-in {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}
.header-btn-anim {
  animation: header-btn-in 0.35s ease both;
}
</style>
