<script setup lang="ts">
import { computed, inject } from 'vue'
import ChatInput from '@/components/Global/AI/components/chat/ChatInput.vue'
import QuickCommands from '@/components/Global/AI/components/chat/QuickCommands.vue'
import ScrollToBottom from '@/components/Global/AI/components/chat/ScrollToBottom.vue'
import StickyUserBar from '@/components/Global/AI/components/chat/StickyUserBar.vue'
import WelcomeMessage from '@/components/Global/AI/components/chat/WelcomeMessage.vue'
import AiHeader from '@/components/Global/AI/components/header/HeaderBar.vue'
import MessageItem from '@/components/Global/AI/components/message/MessageItem.vue'
import ResizeBar from '@/components/Global/AI/components/ui/ResizeBar.vue'
// Business effects — auto-trigger side effects on new business messages
import { useActionWatcher, useCardActions } from '@/components/Global/AI/composables/business'
import { useChatScroll } from '@/components/Global/AI/composables/useChatScroll'
import { useChatVirtualList } from '@/components/Global/AI/store/useChatVirtualList'
import { useConversationStore } from '@/components/Global/AI/store/useConversationStore'
import { useMessageHover } from '@/components/Global/AI/store/useMessageHover'
import { usePanelState } from '@/components/Global/AI/store/usePanelState'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'
import { useHighlightTheme } from '@/components/Global/AI/utils/highlight-theme'

defineOptions({ name: 'ChatPanel' })

useHighlightTheme()

const baseZIndex = inject<number>('ai-z-index', 2000)
const { transitioning: vtActive, isContentAside, panelInnerWidth, panelInnerHeight, floatingPosition } = usePanelState()

const rootStyle = computed(() => {
  const vtName = { viewTransitionName: 'ai-panel' }
  if (isContentAside.value) {
    return { position: 'relative' as const, height: '100%', ...vtName }
  }
  return { position: 'fixed' as const, zIndex: baseZIndex, ...floatingPosition.value, ...vtName }
})

// ── AI state ──
const {
  messages,
  hasMessages,
} = useConversationStore()
const {
  isLoading,
} = useStreamManager()

// ── Business actions ──
// Action: 监听消息 → 查 ACTION_HANDLER_MAP → 执行 → 清除 businessContent
useActionWatcher()
// Card: 提供 confirm/cancel 通用交互
useCardActions()

// ── Virtual scroll ──
const { virtualizer, scrollContainerRef, showScrollButton, scrollToBottom, measureAndCache } = useChatVirtualList()

// ── Scroll triggers + sticky bar ──
const { showStickyBar, activeStickyMessage, handleMessagesScroll } = useChatScroll()

// ── Message actions ──
const hover = useMessageHover()
</script>

<template>
  <div class="panel-container" :class="{ fixed: !isContentAside }" :style="rootStyle">
    <!-- Resize bar for content aside mode -->
    <ResizeBar />

    <div
      class="panel-inner flex flex-col overflow-hidden rounded-xl"
      :class="{ 'rounded-none!': isContentAside, 'no-transition': vtActive }"
      :style="{ width: panelInnerWidth, height: panelInnerHeight }"
    >
      <AiHeader />

      <QuickCommands :disabled="isLoading" />

      <!-- Messages -->
      <div class="relative min-h-0 flex-1">
        <div ref="scrollContainerRef" class="messages-container h-full overflow-y-auto p-3" @scroll="handleMessagesScroll">
          <StickyUserBar :message="showStickyBar ? activeStickyMessage : null" />

          <Transition name="fade-up" appear>
            <WelcomeMessage v-if="!hasMessages" />
          </Transition>

          <!-- Virtual message list -->
          <div
            v-if="hasMessages"
            class="virtual-list-wrapper relative"
            :style="{ height: `${virtualizer.getTotalSize()}px` }"
          >
            <template v-for="vItem in virtualizer.getVirtualItems()" :key="vItem.index">
              <div
                v-if="messages[vItem.index]"
                :ref="(el) => measureAndCache(el, vItem.index)"
                :data-index="vItem.index"
                :data-msg-id="messages[vItem.index]!.id"
                class="message absolute left-0 right-0 flex gap-2"
                :class="messages[vItem.index]!.role"
                :style="{ transform: `translateY(${vItem.start}px)` }"
                @mouseenter="hover.onEnter(messages[vItem.index]!.id)"
                @mouseleave="hover.onLeave()"
              >
                <MessageItem
                  :msg="messages[vItem.index]!"
                />
              </div>
            </template>
          </div>

          <ScrollToBottom :visible="showScrollButton && hasMessages" @click="scrollToBottom(true)" />
        </div>
      </div>

      <ChatInput />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-container {
  // Pure positioning layer; excluded from size transitions to avoid interfering with entry animation
}
.panel-inner {
  background: var(--card-color);
  border: 1px solid var(--divider-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: width 0.3s ease, height 0.3s ease;
}
.panel-inner.no-transition {
  transition: none !important;
}

.message {
  &.user { flex-direction: row-reverse; }
}

.fade-up-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

/* Sticky bar: take out of flow during leave so content shifts up immediately */
:deep(.slide-in-top-leave-active) {
  position: absolute;
  width: 100%;
}
</style>
