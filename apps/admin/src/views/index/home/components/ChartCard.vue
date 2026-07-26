<script lang="ts" setup>
import type { WHomeChartCardProps } from './types'

defineOptions({
  name: 'WHomeChartCard',
  defaultView: false,
})

defineProps<WHomeChartCardProps>()
</script>

<template>
  <n-card
    hoverable
    :segmented="{
      content: true,
    }"
  >
    <template #header>
      <n-h2 prefix="bar" align-text :type="headerExtra?.tagProps.type">
        <n-text>
          {{ title }}
        </n-text>
      </n-h2>
    </template>

    <template #header-extra>
      <n-tag v-bind="headerExtra?.tagProps">
        <n-gradient-text :type="headerExtra?.tagProps.type">
          {{ headerExtra?.text }}
        </n-gradient-text>
      </n-tag>
    </template>

    <WECharts :option="option" />
  </n-card>
</template>
