<script lang="ts" setup>
import LockDesktop from './src/desktop.vue'
import LockMobile from './src/mobile.vue'

defineOptions({
  name: 'Lock',
})

const appStoreAdapter = useAppStoreAdapter()
const appStoreLock = useAppStoreLock()
appStoreLock.unlockFromSocket()
</script>

<template>
  <div class="h-screen w-screen overflow-hidden">
    <LockMobile v-if="appStoreAdapter.isMobile" />

    <LockDesktop v-else />
  </div>
</template>
