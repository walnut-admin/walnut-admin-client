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
  useAppMsgSuccess(token)
}
</script>

<template>
  <WDemoCard title="Cap">
    <n-button class="mb-2" @click="onNormalMode">
      Cap Validate
    </n-button>
    <br>
    <n-button @click="onInvisible">
      Cap Invisible Validate
    </n-button>
  </WDemoCard>
</template>
