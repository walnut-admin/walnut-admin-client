<script lang="ts" setup>
defineOptions({
  name: 'TheAppGlobalComponents',
})

const appForceQuit = useStoreCompForceQuit()
</script>

<template>
  <WForceQuit v-if="appForceQuit.getShow" />
</template>
