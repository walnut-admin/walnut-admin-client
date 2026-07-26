<script setup lang="ts">
import { computed, provide, toRef, useTemplateRef } from 'vue'
import ChatPanel from './components/core/ChatPanel.vue'
import FloatingTrigger from './components/core/FloatingTrigger.vue'
import { DEFAULT_Z_INDEX } from './config/constants'
import { useAIPreferences } from './store/useAIPreferences'
import { usePanelState } from './store/usePanelState'

defineOptions({ name: 'AIPanel' })

const props = withDefaults(defineProps<{
  zIndex?: number
}>(), {
  zIndex: DEFAULT_Z_INDEX,
})

provide('ai-z-index', toRef(() => props.zIndex))

const aiPrefs = useAIPreferences()

const { visible: panelVisible, transitioning: vtActive, isContentAside: isContentAsideMode } = usePanelState()

const asideTargetRef = useTemplateRef<HTMLElement>('asideTargetRef')
const floatingTargetRef = useTemplateRef<HTMLElement>('floatingTargetRef')

const isContentAsideOpen = computed(() => isContentAsideMode.value && panelVisible.value)
const isFloatingOpen = computed(() => !isContentAsideMode.value && panelVisible.value)

const teleportTarget = computed(() => isContentAsideMode.value ? asideTargetRef.value : floatingTargetRef.value)

const panelTransitionName = computed(() => vtActive.value ? '' : 'slide-right')
</script>

<template>
  <div class="ai-root shrink-0" :style="{ position: 'relative', zIndex: props.zIndex }">
    <!-- Aside target: ChatPanel teleports here in content-aside mode -->
    <Transition :name="vtActive ? '' : 'aside-slide'" appear>
      <aside v-if="isContentAsideOpen" class="ai-content-aside" :style="{ width: `${aiPrefs.asideWidth}px` }">
        <div ref="asideTargetRef" class="h-full" />
      </aside>
    </Transition>

    <!-- Floating target: ChatPanel teleports here in floating mode -->
    <div v-show="!isContentAsideOpen" class="ai-panel-wrapper">
      <Transition appear name="dock">
        <FloatingTrigger v-show="!panelVisible" />
      </Transition>
      <div v-if="isFloatingOpen" ref="floatingTargetRef" key="floating-target" />
    </div>

    <!-- Single ChatPanel, teleported to active target -->
    <Teleport :to="teleportTarget" :disabled="!teleportTarget">
      <Transition :name="panelTransitionName">
        <ChatPanel v-if="panelVisible" key="chat-panel" />
      </Transition>
    </Teleport>
  </div>
</template>

<style>
/* ── View Transition API — panel mode switch ── */
::view-transition-old(ai-panel),
::view-transition-new(ai-panel) {
  animation: 500ms ease both;
}
::view-transition-old(ai-panel) { animation-name: ai-panel-out; }
::view-transition-new(ai-panel) { animation-name: ai-panel-in; }

@keyframes ai-panel-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes ai-panel-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── slide-right transition ── */
.slide-right-enter-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-leave-active {
  transition: opacity 0.18s cubic-bezier(0.4, 0, 1, 1), transform 0.18s cubic-bezier(0.4, 0, 1, 1);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ── AI component base styles ── */
.ai-gradient-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-hover));
}

.ai-root {
  flex-shrink: 0;
}

.ai-content-aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--divider-color);
  background: var(--card-color);
  flex-shrink: 0;
}

.aside-slide-enter-active,
.aside-slide-leave-active {
  transition: width 0.3s ease, opacity 0.25s ease;
  overflow: hidden;
}
.aside-slide-enter-from,
.aside-slide-leave-to {
  width: 0 !important;
  opacity: 0;
}

.dock-enter-active {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out;
}
.dock-leave-active {
  transition: transform 0.3s ease-in, opacity 0.2s ease-in;
}
.dock-enter-from,
.dock-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>
