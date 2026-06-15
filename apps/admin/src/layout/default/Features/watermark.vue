<script lang="ts" setup>
defineOptions({
  name: 'TheAppWatermark',
})

const appSettingScope = useAppStoreSettingScope()
</script>

<template>
  <n-watermark
    v-bind="appSettingScope.getWatermarkConfig($route)"
  />
</template>
