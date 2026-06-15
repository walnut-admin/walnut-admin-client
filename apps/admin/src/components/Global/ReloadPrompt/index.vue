<script setup lang="ts">
defineOptions({
  name: 'WCompGlobalReloadPrompt',
  inheritAttrs: false,
})

const compStoreReloadPrompt = useStoreCompReloadPrompt()

const { needRefresh, offlineReady, reloadFn, closePrompt } = compStoreReloadPrompt
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    role="alert"
    class="fixed bottom-4 right-0 z-999 m-4 border border-gray-400/50 rounded bg-bodyColor p-3 text-left shadow"
  >
    <div class="mb-2">
      <n-text v-if="offlineReady">
        {{ $t('comp.global.reloadPrompt.offlineReady') }}
      </n-text>
      <n-text v-else>
        {{ $t('comp.global.reloadPrompt.newContentAvailable') }}
      </n-text>
    </div>

    <n-button v-if="needRefresh" size="tiny" class="mr-2" @click="reloadFn">
      {{ $t('app.base.refresh') }}
    </n-button>
    <n-button size="tiny" @click="closePrompt">
      {{ $t('app.base.close') }}
    </n-button>
  </div>
</template>
