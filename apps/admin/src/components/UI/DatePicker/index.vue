<script lang="ts" setup>
import type { ICompUIDatePickerProps } from '.'

defineOptions({
  name: 'WCompUIDatePicker',
})

defineProps<ICompUIDatePickerProps>()
</script>

<template>
  <n-date-picker />
</template>
