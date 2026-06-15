<script lang="ts" setup>
import Network from './components/Network.vue'
import UnlockButton from './components/UnlockButton.vue'

const { level, charging } = useSharedBattery()
const now = useNow()
const getPercentLevel = computed(() => level.value * 100)
</script>

<template>
  <div class="relative m-auto h-full w-full overflow-hidden">
    <UnlockButton class="z-20" />

    <div class="absolute left-1/2 top-16 z-20 -translate-x-1/2">
      <div class="flex flex-col items-center gap-y-8">
        <n-time :time="now" format="yyyy/MM/dd" class="text-2xl tracking-wide" />
        <n-time :time="now" format="kk:mm" class="text-8xl tracking-wide" />
      </div>
    </div>

    <div class="absolute bottom-4 right-4 z-20">
      <Network />
    </div>

    <div class="abs-center z-10 text-3xl">
      {{ getPercentLevel }}%
    </div>

    <div class="h-full w-full animate-hue-rotate overflow-hidden bg-bodyColor contrast-[10] hue-rotate-0">
      <div
        class="relative box-border h-full w-full blur-[8px]"
        w:after="content-empty absolute top-1/2 left-1/2 -translate-1/2 w-[200px] h-[200px] rounded-[42%_38%_62%_49%/45%] bg-[#00ff6f] animate-wave-circle"
        w:before="content-empty absolute top-1/2 left-1/2 -translate-1/2 w-175px h-175px rounded-[50%]  z-10"
      />
      <ul class="g-bubbles absolute bottom-0 left-1/2 h-[40px] w-[100px] rounded-[100px_100px_0_0] bg-[#00ff6f] blur-[5px] -translate-x-1/2">
        <template v-if="charging">
          <li v-for="i in 15" :key="i" class="absolute list-none rounded-[50%] bg-[#00ff6f]" />
        </template>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

@for $i from 0 through 15 {
  li:nth-child(#{$i}) {
    $width: 15 + math.random(15) + px;
    left: 15 + math.random(70) + px;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $width;
    height: $width;
    animation: moveToTop
      #{math.random(6) +
      3}s
      ease-in-out -#{math.div(math.random(5000), 1000)}s
      infinite;
  }
}

@keyframes moveToTop {
  90% {
    opacity: 1;
  }

  100% {
    opacity: 0.1;
    transform: translate(-50%, calc(0vh - 50vh + 100px));
  }
}
</style>
