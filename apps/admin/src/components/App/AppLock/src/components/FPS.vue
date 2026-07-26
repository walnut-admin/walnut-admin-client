<script lang="ts" setup>
defineOptions({
  name: 'WAppLockFPS',
})

const fps = useFps()
</script>

<template>
  <div class="absolute left-2 top-2 text-white">
    {{ fps }}
  </div>
</template>

<style lang="scss" scoped>

</style>
