<script lang="ts" setup>
import type { ICompExtraScrollbarInst } from '@/components/Extra/Scrollbar'

defineOptions({
  name: 'ScrollbarDemo',
  defaultView: false,
})

const position = ref(0)
const positionHorizontal = ref(0)

const overflow = ref(false)
const overflowHorizontal = ref(false)

const scrollRef = ref<ICompExtraScrollbarInst>()
const scrollHorizontalRef = ref<ICompExtraScrollbarInst>()

watch(
  () => position.value,
  () => {
    overflow.value = scrollRef.value?.getIsOverflow() ?? false
  },
  { immediate: true },
)

watch(
  () => positionHorizontal.value,
  () => {
    overflowHorizontal.value = scrollHorizontalRef.value?.getIsOverflow() ?? false
  },
  { immediate: true },
)
</script>

<template>
  <WDemoCard title="Scrollbar">
    <WTitle prefix="bar" class="mb-2">
      Vertical Position: {{ position }} || Overflow: {{ overflow }}
    </WTitle>

    <n-space size="small">
      <n-button @click="scrollRef?.scrollTo({ top: 800 })">
        Scroll to 800px
      </n-button>
      <n-button @click="scrollRef?.scrollTo({ top: 1600 })">
        Scroll to 1600px
      </n-button>

      <n-button @click="scrollRef?.scrollToStart()">
        Scroll to Top
      </n-button>
      <n-button @click="scrollRef?.scrollToEnd()">
        Scroll to Bottom
      </n-button>

      <n-button @click="scrollRef?.scrollToIndex(20)">
        Scroll to index 20
      </n-button>

      <n-button @click="scrollRef?.scrollToIndex(60)">
        Scroll to index 60
      </n-button>
    </n-space>

    <div class="mt-2 border border-2 border-gray-600 rounded-sm">
      <WScrollbar
        ref="scrollRef"
        v-model:value="position"
        height="500px"
        width="400px"
      >
        <div v-for="i in 100" :key="i" class="text-3xl">
          Horizontal-{{ i }}
        </div>
      </WScrollbar>
    </div>

    <n-divider />

    <WTitle prefix="bar" class="mb-2">
      Horizontal Position: {{ positionHorizontal }} || Overflow:
      {{ overflowHorizontal }}
    </WTitle>

    <n-space size="small">
      <n-button @click="scrollHorizontalRef?.scrollTo({ left: 800 })">
        Scroll to 800px
      </n-button>
      <n-button @click="scrollHorizontalRef?.scrollTo({ left: 1600 })">
        Scroll to 1600px
      </n-button>

      <n-button @click="scrollHorizontalRef?.scrollToStart()">
        Scroll to Left
      </n-button>
      <n-button @click="scrollHorizontalRef?.scrollToEnd()">
        Scroll to Right
      </n-button>

      <n-button @click="scrollHorizontalRef?.scrollToIndex(40)">
        Scroll to index 40
      </n-button>

      <n-button @click="scrollHorizontalRef?.scrollToIndex(80)">
        Scroll to index 80
      </n-button>
    </n-space>

    <div class="mt-2 h-12 border border-2 border-gray-600 rounded-sm">
      <WScrollbar
        ref="scrollHorizontalRef"
        v-model:value="positionHorizontal"
        x-scrollable
        height="100px"
        width="70vw"
        :x-step="100"
        :scrollbar="false"
      >
        <div class="hstack whitespace-nowrap">
          <div v-for="i in 100" :key="i" class="mx-3 text-3xl">
            Vertical-{{ i }}
          </div>
        </div>
      </WScrollbar>
    </div>
  </WDemoCard>
</template>
