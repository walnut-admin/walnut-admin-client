<script lang="ts" setup>
import type { ICompUITimePickerProps } from '.'

defineOptions({
  name: 'WCompUITimePicker',
})

defineProps<ICompUITimePickerProps>()
</script>

<template>
  <n-time-picker />
</template>
