<script lang="ts" setup>
import type { ICompUIButtonGroupProps } from '.'

defineOptions({
  name: 'WCompUIButtonGroup',
})

defineProps<ICompUIButtonGroupProps>()
</script>

<template>
  <n-button-group>
    <WButton v-for="(item, index) in groups" :key="index" v-bind="item" />
  </n-button-group>
</template>
