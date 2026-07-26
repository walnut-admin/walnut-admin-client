<script lang="ts" setup>
import { option1, option2, option3 } from './option'

defineOptions({
  name: 'EChartsDemo',
})
</script>

<template>
  <WDemoCard title="ECharts Demo">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Line
        </WTitle>

        <WECharts :option="option1" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Bar
        </WTitle>

        <WECharts :option="option2" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Pie
        </WTitle>

        <WECharts :option="option3" />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
