<script lang="ts" setup>
defineOptions({
  name: 'AppLock',
})

const appStoreLock = useAppStoreLock()
const { currentRoute } = useAppRouter()

async function onLock() {
  await appStoreLock.lock(currentRoute)
}
</script>

<template>
  <div>
    <WIcon icon="ant-design:lock-outlined" height="24" :disabled="appStoreLock.getLoading" @click="onLock" />
  </div>
</template>
