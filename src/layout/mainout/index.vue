<script lang="ts" setup>
import { mainoutRoutes } from '@/router/routes/mainout'
import { isDev } from '@/utils/constant/vue'

defineOptions({
  name: 'Mainout',
})

const appStoreBackendSettings = useAppStoreSettingBackend()
const router = useAppRouter()

const getMainoutRouteOptions = computed(() => {
  return mainoutRoutes.map(item => ({
    label: `${item.name as string}(auth: ${item.meta?._auth})`,
    value: item.path,
  }))
})

function onChange(path: string) {
  router.push(path)
}

// get user preference
const appStorePreference = useAppStoreUserPreference()
onBeforeMount(() => {
  appStorePreference.onInitPreference()
})
</script>

<template>
  <div class="relative min-h-screen w-full">
    <!--  main content area with max-width constraint -->
    <div class="min-h-screen flex items-center justify-center">
      <router-view />
    </div>

    <!-- mainout route selector (visible only in dev mode) -->
    <div v-if="isDev()" class="fixed left-4 top-4 z-50 w-72 sm:left-8 sm:top-8 sm:w-96">
      <n-select
        v-model:value="$route.path"
        :options="getMainoutRouteOptions"
        @update:value="onChange"
      />
    </div>

    <!-- mainout global controls -->
    <div class="fixed right-4 top-4 z-50 flex items-center gap-2 sm:right-8 sm:top-8 sm:gap-4">
      <n-button v-if="appStoreBackendSettings.getLocaleEnabled" text>
        <WAppLocalePicker />
      </n-button>
      <n-button v-if="appStoreBackendSettings.getDarkEnabled" text>
        <WAppDarkMode />
      </n-button>
    </div>
  </div>
</template>
