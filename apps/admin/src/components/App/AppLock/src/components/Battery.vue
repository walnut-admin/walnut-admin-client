<script lang="ts" setup>
defineOptions({
  name: 'WAppLockBattery',
})

const { level, charging } = useSharedBattery()

const getPercentLevel = computed(() => level.value * 100)

const getIcon = computed(() => {
  if (charging.value)
    return 'carbon:battery-charging'

  if (getPercentLevel.value <= 5)
    return 'carbon:battery-empty'

  if (getPercentLevel.value > 5 && getPercentLevel.value < 35)
    return 'carbon:battery-low'

  if (getPercentLevel.value > 35 && getPercentLevel.value < 65)
    return 'carbon:battery-quarter'

  if (getPercentLevel.value > 65 && getPercentLevel.value < 95)
    return 'carbon:battery-half'

  return 'carbon:battery-full'
})
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <WIcon :icon="getIcon" height="24" color="white" />
    </template>

    <template #default>
      {{ getPercentLevel }} %
    </template>
  </n-tooltip>
</template>
