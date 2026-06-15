<script lang="ts" setup>
import { urls } from '~build/package'

defineOptions({
  name: 'QRCodeDemo',
  defaultView: false,
})

const getUrl = () => `https://www.baidu.com/?t=${Date.now()}`

const url = ref(urls.doc)

const url2 = ref(getUrl())
const success = ref(false)

function onRefresh(callback: Fn) {
  url2.value = getUrl()
  callback()
}
</script>

<template>
  <WDemoCard title="QR code component, using `useQRCode`">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic usage
        </WTitle>

        <WQRCode :url="url" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          With specific expired seconds
        </WTitle>

        <WQRCode :url="url2" :expire-seconds="5" @refresh="onRefresh" />
      </n-list-item>

      <n-list-item>
        <n-space vertical size="small">
          <WTitle prefix="bar" class="mb-2">
            Success
          </WTitle>

          <n-switch v-model:value="success" class="mb-2" />

          <WQRCode :url="url" :success="success" />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
