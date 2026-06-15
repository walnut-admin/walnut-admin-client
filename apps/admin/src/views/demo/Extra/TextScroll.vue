<script lang="ts" setup>
defineOptions({
  name: 'TextScrollDemo',
  defaultView: false,
})

const texts = [
  'aaaaaaaaaaaaa',
  'bbbbbbbbbbbbb',
  'ccccccccccccc',
  'ddddddddddddd',
  'eeeeeeeeeeeee',
]
</script>

<template>
  <WDemoCard title="Text Scroll">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Horizontal
        </WTitle>

        <n-space vertical>
          <WTextScroll :texts="texts" class="w-[150px] ring-1" />

          <WTextScroll :texts="texts" :speed="4000" class="w-[150px] ring-1" />

          <WTextScroll class="w-[150px] ring-1">
            a span
          </WTextScroll>

          <WTextScroll class="w-[150px] ring-1">
            use maxLength to controll scrolling
          </WTextScroll>

          <WTextScroll class="w-[150px] ring-1" :max-length="100">
            use maxLength to controll scrolling
          </WTextScroll>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Vertical
        </WTitle>

        <n-space vertical>
          <WTextScroll mode="vertical" :texts="texts" class="h-[24px] w-[150px] ring-1" />

          <WTextScroll
            mode="vertical"
            :texts="texts"
            :speed="8000"
            class="h-[24px] w-[150px] ring-1"
          />

          <WTextScroll mode="vertical" class="h-[24px] w-[150px] ring-1">
            a span
          </WTextScroll>

          <WTextScroll mode="vertical" class="h-[24px] w-[150px] ring-1">
            use maxLength to controll scrolling
          </WTextScroll>

          <WTextScroll mode="vertical" class="h-[24px] w-[150px] ring-1" :max-length="100">
            use maxLength to controll scrolling
          </WTextScroll>
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
