<script lang="ts" setup>
import { useSharedNetwork } from '@walnut/core/hooks/vueuse/useNetwork'

defineOptions({
  name: 'WAppLockNetwork',
})

const { isOnline, downlink } = useSharedNetwork()

const getIcon = computed(() => {
  if (!isOnline.value)
    return 'carbon:wifi-off'

  return 'carbon:wifi'
})
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <WIcon :icon="getIcon" height="24" color="white" />
    </template>

    <template #default>
      {{ downlink }} Mbps
    </template>
  </n-tooltip>
</template>
