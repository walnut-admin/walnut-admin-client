<script lang="ts" setup>
import type { ICompUIButtonConfirmProps } from '.'

defineOptions({
  name: 'WCompUIButtonConfirm',
})

const { confirmMsg = 'app.base.confirm' } = defineProps<ICompUIButtonConfirmProps>()

const emits = defineEmits<{ confirm: [e: MouseEvent] }>()

function onPositiveClick(e: MouseEvent) {
  emits('confirm', e)
}
</script>

<template>
  <n-popconfirm @positive-click="onPositiveClick">
    <template #default>
      {{ $t(confirmMsg) }}
    </template>

    <template #trigger>
      <WButton v-bind="buttonProps" :debounce="0">
        <slot />
      </WButton>
    </template>
  </n-popconfirm>
</template>
