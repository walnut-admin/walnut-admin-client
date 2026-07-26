<script lang="ts" setup>
import Battery from './components/Battery.vue'
import FPS from './components/FPS.vue'
import Network from './components/Network.vue'
import UnlockButton from './components/UnlockButton.vue'

const now = useNow()
</script>

<template>
  <UnlockButton />

  <div class="absolute bottom-8 left-1/2 -translate-x-1/2">
    <n-time :time="now" format="yyyy/MM/dd" class="text-2xl tracking-wide" />
  </div>

  <div class="absolute bottom-4 right-4">
    <div class="flex gap-x-2">
      <Battery />
      <Network />
    </div>
  </div>

  <FPS />

  <div class="h-full w-full flex flex-col items-center self-center justify-center gap-y-4 text-white">
    <WFlipClock />
  </div>
</template>

<style lang="less" scoped>

</style>
