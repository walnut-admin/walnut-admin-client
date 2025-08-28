<script lang="ts" setup>
import LockDesktop from './src/desktop.vue'
import LockMobile from './src/mobile.vue'

defineOptions({
  name: 'Lock',
})

const appStoreAdapter = useAppStoreAdapter()
</script>

<template>
  <div class="absolute bottom-0 left-0 right-0 top-0 h-screen w-screen overflow-hidden bg-black/95 text-white">
    <LockMobile v-if="appStoreAdapter.isMobile" />

    <LockDesktop v-else />
  </div>
</template>
