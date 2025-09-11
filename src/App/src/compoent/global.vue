<script lang="ts" setup>
defineOptions({
  name: 'WAppGlobalComponents',
})

const compStoreReloadPrompt = useStoreCompReloadPrompt()
const compStoreCapJS = useStoreCompCapJS()
</script>

<template>
  <WCap v-if="compStoreCapJS.getShow" />
  <WReloadPrompt v-if="compStoreReloadPrompt.getShow" />
</template>
