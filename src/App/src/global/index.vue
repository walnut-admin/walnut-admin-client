<script lang="ts" setup>
import WAppGlobalComponentCap from './cap.vue'
import WAppGlobalComponentForceQuit from './forceQuit.vue'
// import WAppGlobalComponentReloadPrompt from './reloadPrompt.vue'

defineOptions({
  name: 'WAppGlobalComponents',
})
</script>

<template>
  <WAppGlobalComponentCap />
  <WAppGlobalComponentForceQuit />
  <!-- <WAppGlobalComponentReloadPrompt /> -->
</template>
