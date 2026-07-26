<script lang="ts" setup>
import WHomeChartCard from './components/ChartCard.vue'
import WHomeNumberCard from './components/NumberCard.vue'

import { useChartCard } from './useChartCard'
import { useNumberCard } from './useNumberCard'

defineOptions({
  name: 'Homepage',
})

const { cards: numberCards, loading: numberCardLoading } = useNumberCard()
const { cards: chartCards, loading: chartCardLoading } = useChartCard()
</script>

<template>
  <div>
    <!-- number -->
    <div class="flex flex-wrap">
      <div
        v-for="(item, index) in numberCards"
        :key="index"
        class="w-full rounded-2xl p-1 md:w-1/2 xl:w-1/3 md:pr-1"
      >
        <WTransition appear transition-name="fade-down" :duration="(index + 1) * 200">
          <WHomeNumberCard
            v-bind="item"
            :loading="numberCardLoading"
          />
        </WTransition>
      </div>
    </div>

    <!-- chart -->
    <div class="flex flex-wrap">
      <div
        v-for="(item, index) in chartCards"
        :key="index"
        class="w-full rounded-2xl p-1 md:w-1/2 xl:w-1/2 md:pr-1"
      >
        <WTransition appear transition-name="fade-down" :duration="(index + 1) * 500">
          <!-- @vue-expect-error do not know why -->
          <WHomeChartCard
            v-bind="item"
            :loading="chartCardLoading"
          />
        </WTransition>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.w-card > .w-card-header) {
  padding: 12px 16px !important;
}

:deep(.w-h) {
  margin: 0;
}
</style>
