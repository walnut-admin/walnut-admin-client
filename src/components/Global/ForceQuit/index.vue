<script lang="ts" setup>
defineOptions({
  name: 'WCompGlobalForceQuit',
  inheritAttrs: false,
})

const loading = ref(false)

const userStoreAuth = useAppStoreUserAuth()
const compStoreForceQuit = useStoreCompForceQuit()

const { retryText, clear, resume } = useCountdownStorage({
  persistKey: 'force-quit',
  persistSeconds: 10,
  onCountdownComplete: onForceQuit,
})

resume()

async function onForceQuit() {
  if (loading.value)
    return
  loading.value = true

  try {
    clear()
    compStoreForceQuit.onCloseForceQuitModal()
    compStoreForceQuit.$reset()
    await userStoreAuth.Signout()
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <WModal
    v-model:show="compStoreForceQuit.show!"
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
