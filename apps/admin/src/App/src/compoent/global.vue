<script lang="ts" setup>
import { useGlobalAsyncComponent } from '@walnut/core/hooks/component/useGlobalAsyncComponent'

defineOptions({
  name: 'WAppGlobalComponents',
})

const compStoreReloadPrompt = useStoreCompReloadPrompt()
const compStoreCapJS = useStoreCompCapJS()
const compStoreVerifyAuth = useStoreCompVerifyAuth()

const reloadPrompt = useGlobalAsyncComponent(
  computed(() => compStoreReloadPrompt.getShow),
  { unmountDelay: 200 },
)

const cap = useGlobalAsyncComponent(
  computed(() => compStoreCapJS.getShow),
  { unmountDelay: 350 },
)

const verifyAuth = useGlobalAsyncComponent(
  computed(() => compStoreVerifyAuth.getShow),
  { unmountDelay: 350 },
)
</script>

<template>
  <div v-if="cap.mounted" v-show="cap.visible">
    <WCap />
  </div>
  <div v-if="reloadPrompt.mounted" v-show="reloadPrompt.visible">
    <WReloadPrompt />
  </div>
  <div v-if="verifyAuth.mounted" v-show="verifyAuth.visible">
    <WVerifyAuth />
  </div>
</template>
