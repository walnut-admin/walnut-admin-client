<script lang="ts" setup>
defineOptions({
  name: 'FlipperDemo',
  defaultView: false,
})
</script>

<template>
  <WDemoCard title="Flipper">
    <n-space size="small">
      <WFlipper trigger="hover" width="270px" height="300px">
        <template #front>
          <div class="h-full w-full">
            hover to flip
          </div>
        </template>

        <template #back>
          <div class="h-full w-full">
            this is back
          </div>
        </template>
      </WFlipper>

      <WFlipper trigger="click" width="270px" height="300px">
        <template #front>
          <div class="h-full w-full">
            click to flip
          </div>
        </template>

        <template #back>
          <div class="h-full w-full">
            this is back
          </div>
        </template>
      </WFlipper>
    </n-space>
  </WDemoCard>
</template>
