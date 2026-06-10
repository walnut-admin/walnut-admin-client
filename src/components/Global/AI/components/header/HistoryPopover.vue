<script setup lang="ts">
import { NPopconfirm, NPopover } from 'naive-ui'
import { inject } from 'vue'
import { DEFAULT_Z_INDEX, POPOVER_Z_INDEX_OFFSET } from '@/components/Global/AI/config/constants'
import { useConversationHistory } from '@/components/Global/AI/store/useConversationHistory'
import { useConversationLifecycle } from '@/components/Global/AI/store/useConversationLifecycle'
import { useConversationStore } from '@/components/Global/AI/store/useConversationStore'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'
import { timeAgo } from '@/components/Global/AI/utils/format'
import StatusDot from '../ui/StatusDot.vue'

defineOptions({ name: 'HistoryPopover' })

const baseZIndex = inject<number>('ai-z-index', DEFAULT_Z_INDEX)
const store = useConversationStore()
const stream = useStreamManager()
const { deleteConversation } = useConversationLifecycle()
const { conversationList: conversations, clearMessages } = store
const { isConversationLoading } = stream

const {
  searchKeyword,
  filteredConversations,
  hoveredConvId,
  historyPopoverVisible,
  editingConvId,
  editingTitle,
  startEditTitle,
  saveTitle,
  cancelEdit,
  handleSwitchConversation,
} = useConversationHistory()
</script>

<template>
  <NPopover
    :show="historyPopoverVisible"
    trigger="click"
    placement="bottom-end"
    :width="280"
    :show-arrow="false"
    :z-index="baseZIndex + POPOVER_Z_INDEX_OFFSET"
    @update:show="(v: boolean) => historyPopoverVisible = v"
  >
    <template #trigger>
      <button
        class="ai-header-btn header-btn-anim"
        style="animation-delay: 200ms"
        title="对话历史"
      >
        <WIcon icon="carbon:time" width="14" />
      </button>
    </template>
    <div class="flex flex-col">
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-13px transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="clearMessages(); historyPopoverVisible = false"
      >
        <WIcon icon="carbon:add" width="14" class="text-primary" />
        <span>新对话</span>
      </div>
      <div v-if="conversations.length > 0" class="mx-2 my-1 border-t border-gray-200 dark:border-gray-700" />
      <div v-if="conversations.length > 0" class="px-2 py-1.5">
        <div class="relative flex items-center">
          <WIcon icon="carbon:search" width="12" class="absolute left-2 text-gray-400" />
          <input
            v-model="searchKeyword"
            class="w-full border rounded-md bg-gray-50 py-1 pl-7 pr-6 text-12px outline-none transition-colors focus:border-primary dark:bg-gray-800 placeholder:text-gray-400"
            placeholder="搜索对话..."
          >
          <WIcon
            v-if="searchKeyword"
            icon="carbon:close" width="12" class="absolute right-2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"

            @click="searchKeyword = ''"
          />
        </div>
      </div>
      <div v-if="filteredConversations.length > 0" class="max-h-240px overflow-y-auto px-1">
        <div
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="flex flex-col cursor-pointer rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          @mouseenter="hoveredConvId = conv.id"
          @mouseleave="hoveredConvId = ''"
          @click="handleSwitchConversation(conv.id)"
        >
          <div v-if="editingConvId === conv.id" class="flex items-center gap-1" @click.stop>
            <input
              v-model="editingTitle"
              class="flex-1 border border-primary rounded-md px-1.5 py-0.5 text-12px outline-none"
              @keydown.enter="saveTitle()"
              @keydown.escape="cancelEdit()"
            >
            <WIcon icon="carbon:checkmark" width="14" class="text-success shrink-0 cursor-pointer" title="保存" @click.stop="saveTitle()" />
            <WIcon icon="carbon:close" width="14" class="shrink-0 cursor-pointer text-gray-400 hover:text-gray-600" title="取消" @click.stop="cancelEdit()" />
          </div>
          <template v-else>
            <div class="flex items-center gap-1.5">
              <StatusDot v-if="isConversationLoading(conv.id)" color="var(--success-color)" pulse />
              <span class="max-w-160px flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-13px">{{ conv.title }}</span>
              <div class="conv-actions ml-auto flex items-center gap-0.5" :class="{ 'opacity-0': hoveredConvId !== conv.id }">
                <WIcon icon="carbon:edit" width="14" class="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-primary" title="编辑标题" @click.stop="startEditTitle(conv)" />
                <NPopconfirm @positive-click="deleteConversation(conv.id)">
                  <template #trigger>
                    <WIcon icon="carbon:trash-can" width="14" class="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-error" title="删除对话" @click.stop />
                  </template>
                  确定删除该对话？
                </NPopconfirm>
              </div>
            </div>
            <div class="mt-0.5 flex items-center gap-2 text-10px text-gray-400">
              <span>{{ conv.count }} 条消息</span>
              <span>{{ timeAgo(conv.updatedAt) }}</span>
            </div>
          </template>
        </div>
      </div>
      <div v-if="searchKeyword && filteredConversations.length === 0 && conversations.length > 0" class="px-3 py-4 text-center text-12px text-gray-400">
        无匹配对话
      </div>
    </div>
  </NPopover>
</template>
