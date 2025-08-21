<script lang="ts" setup>
defineOptions({
  name: 'WCompBusinessForceQuit',
  inheritAttrs: false,
})

const loading = ref(false)

const appForcequit = useAppStoreForceQuit()
const { retryText, resume } = useCountdownStorage({ persistKey: 'force-quit', persistSeconds: 10, onCountdownComplete: onForceQuit })
resume()

async function onForceQuit() {
  loading.value = true

  try {
    appForcequit.onCloseForceQuitModal()
    const userAuth = useAppStoreUserAuth()
    await userAuth.Signout()
    appForcequit.$reset()
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <WModal
    v-model:show="appForcequit.modalShow!"
    :close-on-esc="false"
    :closable="false"
    :mask-closable="false"
    :default-button="false"
    :fullscreen="false"
    :title="$t('comp.forceQuit.title')"
    width="330px"
    type="warning"
  >
    <div class="my-2 text-center text-2xl">
      {{ retryText }}
    </div>

    <template v-if="appForcequit.quitButton" #action>
      <div class="text-right">
        <WButton type="warning" :loading="loading" :debounce="500" @click="onForceQuit">
          {{ $t('comp.forceQuit.now') }}
        </WButton>
      </div>
    </template>
  </WModal>
</template>
