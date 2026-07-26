<script lang="ts" setup>
// https://www.cnblogs.com/Arunoido/p/13937030.html?ivk_sa=1024320u
defineOptions({
  name: 'SignInWithQR',
  defaultView: false,
})

const getUrl = () => `https://www.baidu.com/?t=${Date.now()}`

const url = ref(getUrl())

function onRefreshQRCode(cb: Fn) {
  url.value = getUrl()

  cb()
}
</script>

<template>
  <div class="mt-4 vstack items-center justify-center gap-y-2">
    <WQRCode
      :url="url"
      :expire-seconds="5"
      @refresh="onRefreshQRCode"
    />

    <span class="break-all">{{ $t('form.app.auth.scan') }}</span>
  </div>
</template>
