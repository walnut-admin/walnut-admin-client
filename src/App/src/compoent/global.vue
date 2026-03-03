<script lang="ts" setup>
defineOptions({
  name: 'WAppGlobalComponents',
})

const compStoreReloadPrompt = useStoreCompReloadPrompt()
const compStoreCapJS = useStoreCompCapJS()
const compStoreVerifyAuth = useStoreCompVerifyAuth()
</script>

<template>
  <WCap v-if="compStoreCapJS.getShow" />
  <WReloadPrompt v-if="compStoreReloadPrompt.getShow" />
  <WVerifyAuth v-if="compStoreVerifyAuth.getShow" />
</template>
