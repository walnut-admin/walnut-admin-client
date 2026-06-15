<script lang="ts" setup>
import type { ICompExtraMessageProps } from '.'

defineOptions({
  name: 'WCompExtraMessage',
})

withDefaults(defineProps<ICompExtraMessageProps>(), {
  icon: 'ant-design:info-circle-filled',
})
</script>

<template>
  <span class="leading-0">
    <n-tooltip v-bind="$attrs">
      <template #default>
        <template v-if="typeof msg === 'string'">
          <div class="whitespace-pre-line">{{ msg }}</div>
        </template>

        <template v-if="Array.isArray(msg)">
          <div v-for="(item, index) in msg" :key="index" class="whitespace-pre-line">{{ item }}</div>
        </template>
      </template>

      <template #trigger>
        <WIcon :icon="icon" width="16" />
      </template>
    </n-tooltip>
  </span>
</template>
