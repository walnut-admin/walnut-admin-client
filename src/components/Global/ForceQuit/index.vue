<script lang="ts" setup>
defineOptions({
  name: 'WCompGlobalForceQuit',
  inheritAttrs: false,
})

const loading = ref(false)

const compStoreForceQuit = useStoreCompForceQuit()
const { retryText, resume, pause } = useCountdownStorage({ persistKey: 'force-quit', persistSeconds: 10, onCountdownComplete: onForceQuit })
resume()

async function onForceQuit() {
  loading.value = true

  try {
    compStoreForceQuit.onCloseForceQuitModal()
    const userStoreAuth = useAppStoreUserAuth()
    pause()
    await userStoreAuth.Signout()
    compStoreForceQuit.$reset()
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <WModal
    v-model:show="compStoreForceQuit.getShow"
    :close-on-esc="false"
    :closable="false"
    :mask-closable="false"
    :default-button="false"
    :fullscreen="false"
    :title="$t('comp.global.forceQuit.title')"
    width="330px"
    type="warning"
  >
    <div class="my-2 text-center text-2xl">
      {{ retryText }}
    </div>

    <template v-if="compStoreForceQuit.getShowQuitButton" #action>
      <div class="text-right">
        <WButton type="warning" :loading="loading" :debounce="500" @click="onForceQuit">
          {{ $t('comp.global.forceQuit.now') }}
        </WButton>
      </div>
    </template>
  </WModal>
</template>
