<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const intervalMS = 60 * 60 * 1000

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  },
})

async function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    role="alert"
    class="bg-base-color fixed bottom-4 right-0 z-999 m-4 border border-gray-400/50 rounded p-3 text-left shadow"
  >
    <div class="mb-2">
      <n-text v-if="offlineReady">
        App ready to work offline
      </n-text>
      <n-text v-else>
        New content available, click on reload button to update.
      </n-text>
    </div>

    <n-button v-if="needRefresh" size="tiny" class="mr-2" @click="updateServiceWorker()">
      Reload
    </n-button>
    <n-button size="tiny" @click="close">
      Close
    </n-button>
  </div>
</template>
