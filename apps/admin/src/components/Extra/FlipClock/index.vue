<script lang="ts" setup>
import { formatTime } from 'easy-fns-ts'
import FlipItem from './item.vue'

defineOptions({
  name: 'WCompExtraFlipClock',
})

const now = useNow()

const getTimeArr = computed(() => {
  const time = formatTime(now.value, 'HH-mm-ss')
  const splitTime = time.split('-')

  return [
    Number.parseInt(splitTime[0].split('')[0]),
    Number.parseInt(splitTime[0].split('')[1]),
    Number.parseInt(splitTime[1].split('')[0]),
    Number.parseInt(splitTime[1].split('')[1]),
    Number.parseInt(splitTime[2].split('')[0]),
    Number.parseInt(splitTime[2].split('')[1]),
  ]
})
</script>

<template>
  <div class="flex items-center">
    <FlipItem :total="2" :current="getTimeArr[0]" />
    <FlipItem :total="9" :current="getTimeArr[1]" />

    <div
      class="h-[50px] flex flex-col justify-around px-[10px]"
      w:after="content-empty block w-[10px] h-[10px] bg-gray-400 rounded-full"
      w:before="content-empty block w-[10px] h-[10px] bg-gray-400 rounded-full"
    />

    <FlipItem :total="5" :current="getTimeArr[2]" />
    <FlipItem :total="9" :current="getTimeArr[3]" />

    <div
      class="h-[50px] flex flex-col justify-around px-[10px]"
      w:after="content-empty block w-[10px] h-[10px] bg-gray-400 rounded-full"
      w:before="content-empty block w-[10px] h-[10px] bg-gray-400 rounded-full"
    />

    <FlipItem :total="5" :current="getTimeArr[4]" />
    <FlipItem :total="9" :current="getTimeArr[5]" />
  </div>
</template>
