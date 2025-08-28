<script lang="ts" setup>
const appStoreCapJSToken = useAppStoreCapJSToken()
</script>

<template>
  <component :is="appStoreCapJSToken.getCapComponent" v-if="appStoreCapJSToken.getCapComponent" />
</template>
