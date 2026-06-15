<script setup lang="ts">
import { inject } from 'vue'
import AnimatedLogo from '@/components/App/AnimatedLogo/index.vue'
import { useFloatingDock } from '@/components/Global/AI/store/useFloatingDock'

defineOptions({ name: 'FloatingTrigger' })

const baseZIndex = inject<number>('ai-z-index', 2000)
const { isDragging, triggerStyle, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useFloatingDock()
</script>

<template>
  <div
    class="trigger-root fixed select-none"
    :class="{ 'is-dragging': isDragging }"
    :style="{ ...triggerStyle, zIndex: baseZIndex }"
  >
    <div class="glow pointer-events-none absolute left-1/2 top-1/2 z--1 rounded-full" />

    <div
      class="pill absolute right-0 top-1/2 overflow-hidden"
      title="ZhenFly AI"
      @pointerdown.prevent="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
    >
      <div class="logo-img absolute top-1/2">
        <AnimatedLogo :size="20" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$dur:    0.5s;
$spring: cubic-bezier(0.16, 1, 0.3, 1);
$ease:   cubic-bezier(0.25, 0, 0, 1);

// 鼠标离开后延迟收起，模拟原来 1s hide timer
$leave-delay: 1s;

// ── 根容器 ─────────────────────────────────────────────
.trigger-root {
  width: 36px;
  height: 32px;
}

// ── 光晕 ───────────────────────────────────────────────
.glow {
  width: 160px;
  height: 160px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--primary-color) 60%, transparent) 0%,
    color-mix(in srgb, var(--primary-color-hover) 35%, transparent) 45%,
    transparent 70%
  );
  filter: blur(20px);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
  // 离开时延迟消失
  transition: opacity 0.8s $ease $leave-delay, transform 0.9s $spring $leave-delay;
}
.trigger-root:hover .glow,
.trigger-root.is-dragging .glow {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  // 进入时立即响应
  transition: opacity 0.8s $ease, transform 0.9s $spring;
}

// ── pill ───────────────────────────────────────────────
// 默认：收起状态，离开时带 delay 收起
.pill {
  height: 32px;
  background: white !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 2px solid #36b4e7;
  cursor: pointer;
  will-change: transform, width;

  width: 60px;
  border-radius: 16px 0 0 16px;
  transform: translate(28px, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  transition:
    width         $dur $spring $leave-delay,
    border-radius $dur $spring $leave-delay,
    transform     $dur $spring $leave-delay,
    border-color  0.3s ease    $leave-delay,
    box-shadow    0.35s $ease  $leave-delay;
}

// 展开状态：hover 或拖拽中，立即响应
.trigger-root:hover .pill,
.trigger-root.is-dragging .pill {
  width: 44px;
  border-radius: 17px 0 0 17px;
  transform: translate(0, -50%);
  border-color: color-mix(in srgb, #36b4e7 22%, transparent);
  box-shadow:
    0 4px 20px color-mix(in srgb, var(--primary-color) 22%, transparent),
    0 2px 4px rgba(0, 0, 0, 0.06);
  border-right: none;

  transition:
    width         $dur $spring,
    border-radius $dur $spring,
    transform     $dur $spring,
    border-color  0.3s ease,
    box-shadow    0.35s $ease;
}

.trigger-root.is-dragging .pill {
  cursor: grabbing;
}

// ── logo ───────────────────────────────────────────────
// 关键修复：left 改用 translateX，消除 layout 与 compositor 时序差
// 收起：translateX(8px)，离开时带 delay
.logo-img {
  left: 0;
  transform: translateX(8px) scaleX(-1) translateY(-50%);
  transition: transform $dur $spring $leave-delay;
  animation: breathe 3s ease-in-out infinite;
}

// 按下反馈（仅点击时，拖拽时不触发）
.trigger-root:not(.is-dragging) .pill:active .logo-img {
  transform: translateX(13px) scaleX(-1) translateY(-50%) scale(0.92);
}

// 展开：translateX(13px) + scale，hover 或拖拽时立即响应
.trigger-root:hover .logo-img,
.trigger-root.is-dragging .logo-img {
  transform: translateX(13px) scaleX(-1) translateY(-50%) scale(1.15);
  animation-play-state: paused;
  transition: transform $dur $spring;
}

@keyframes breathe {
  0%, 100% { opacity: 0.65; }
  50%       { opacity: 1; }
}
</style>
