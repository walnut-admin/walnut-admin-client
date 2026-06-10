<script setup lang="ts">
import { ref } from 'vue'
import { useAIPreferences } from '@/components/Global/AI/store/useAIPreferences'
import { usePanelState } from '@/components/Global/AI/store/usePanelState'

defineOptions({ name: 'DragHandle' })

const emit = defineEmits<{
  dragstart: []
}>()

const { panelSize } = usePanelState()

const aiPrefs = useAIPreferences()

const isDragging = ref(false)
let startX = 0
let startY = 0
let startRight = 0
let startBottom = 0

function clampRight(val: number) {
  return Math.max(0, Math.min(val, window.innerWidth - panelSize.value.width))
}
function clampBottom(val: number) {
  return Math.max(0, Math.min(val, window.innerHeight - panelSize.value.height))
}

function onPointerDown(e: PointerEvent) {
  isDragging.value = true
  emit('dragstart')
  startX = e.clientX
  startY = e.clientY
  startRight = aiPrefs.value.panelRight
  startBottom = aiPrefs.value.panelBottom
  ;(e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId)
  document.body.style.userSelect = 'none'
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value)
    return
  aiPrefs.value.panelRight = clampRight(startRight + startX - e.clientX)
  aiPrefs.value.panelBottom = clampBottom(startBottom + startY - e.clientY)
}

function onPointerUp(e: PointerEvent) {
  isDragging.value = false
  ;(e.currentTarget as HTMLElement)?.releasePointerCapture(e.pointerId)
  document.body.style.userSelect = ''
}

function onPointerCancel(e: PointerEvent) {
  isDragging.value = false
  ;(e.currentTarget as HTMLElement)?.releasePointerCapture(e.pointerId)
  document.body.style.userSelect = ''
}
</script>

<template>
  <button
    class="ai-header-btn"
    :class="{ '!cursor-grabbing': isDragging }"
    title="拖拽移动面板"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
  >
    <WIcon icon="carbon:move" width="14" />
  </button>
</template>
