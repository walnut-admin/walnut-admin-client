<script lang="ts" setup>
import type { ICompUISwitchProps } from '.'

defineOptions({
  name: 'WCompUISwitch',
})

defineProps<ICompUISwitchProps>()
</script>

<template>
  <n-switch>
    <template #checked>
      {{ checkedText }}
    </template>
    <template #unchecked>
      {{ uncheckedText }}
    </template>
  </n-switch>
</template>
