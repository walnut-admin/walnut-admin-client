<script lang="ts" setup>
import { useResizableWidth } from '@/components/Global/AI/composables/useResizableWidth'
import { usePanelState } from '@/components/Global/AI/store/usePanelState'

defineOptions({
  name: 'ResizeBar',
})
const { isContentAside } = usePanelState()
const { isResizing, onPointerDown } = useResizableWidth()
</script>

<template>
  <div
    v-if="isContentAside"
    class="hover:bg-primary-light absolute bottom-0 left-0 top-0 z-10 w-[0.5px] cursor-col-resize select-none"
    :class="{ 'bg-primary': isResizing }"
    @pointerdown="onPointerDown"
  />
</template>
