<script lang="ts" setup>
import type { ICompUICheckboxProps } from '.'

defineOptions({
  name: 'WCompUICheckbox',
})

defineProps<ICompUICheckboxProps>()
</script>

<template>
  <n-checkbox-group>
    <n-space>
      <n-checkbox v-for="item in options" :key="item.value" v-bind="item">
        {{ item.label }}
      </n-checkbox>
    </n-space>
  </n-checkbox-group>
</template>
