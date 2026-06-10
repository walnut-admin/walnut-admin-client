<script lang="ts" setup>
defineOptions({
  name: 'VerifyAuthDemo',
  defaultView: false,
})

const compStoreVerifyAuth = useStoreCompVerifyAuth()

const clickMap: Record<number, () => void> = {
  1: () => {
    compStoreVerifyAuth.onOpenVerifyAuthModal()
  },
  2: () => {
    compStoreVerifyAuth.onOpenVerifyAuthModal({
      mode: 'bind',
    })
  },
}

function onOpen(key: number) {
  clickMap[key]?.()
}
</script>

<template>
  <WDemoCard title="Cap">
    <n-button class="mb-2" @click="onOpen(1)">
      Open verify auth modal
    </n-button>

    <br>

    <n-button class="mb-2" @click="onOpen(2)">
      Open bind auth modal
    </n-button>
  </WDemoCard>
</template>
