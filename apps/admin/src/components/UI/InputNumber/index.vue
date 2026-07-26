<script lang="ts" setup>
import type { ICompUIInputNumberProps } from '.'

defineOptions({
  name: 'WCompUIInputNumber',
})

defineProps<ICompUIInputNumberProps>()
</script>

<template>
  <n-input-number>
    <template #suffix>
      <div v-if="suffix">
        {{ suffix }}
      </div>
      <slot v-else name="suffix" />
    </template>
  </n-input-number>
</template>
