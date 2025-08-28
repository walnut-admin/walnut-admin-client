<script lang="ts" setup>
const appForceQuit = useAppStoreForceQuit()
</script>

<template>
  <component :is="appForceQuit.getForceQuitComponent" v-if="appForceQuit.getForceQuitComponent" />
</template>
