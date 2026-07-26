<script lang="ts" setup>
defineOptions({
  name: 'CapDemo',
  defaultView: false,
})

const compStoreCapJS = useStoreCompCapJS()

async function onNormalMode() {
  await compStoreCapJS.onOpenCapModal(async (token) => {
    useAppMsgSuccess(token)
  })
}

async function onInvisible() {
  const token = await compStoreCapJS.refreshCapJSToken()
  if (!token) {
    useAppMsgError('refresh cap js token failed')
    return
  }
  useAppMsgSuccess(token)
}
</script>

<template>
  <WDemoCard title="Cap">
    <n-button class="mb-2" :loading="compStoreCapJS.loading" @click="onNormalMode">
      Cap Validate
    </n-button>
    <br>
    <n-button :loading="compStoreCapJS.loading" @click="onInvisible">
      Cap Invisible Validate
    </n-button>
  </WDemoCard>
</template>
