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
</script>

<template>
  <div class="relative h-screen w-screen flex items-center justify-center">
    <router-view />

    <div v-if="isDev()" class="absolute left-8 top-8 z-50 w-96">
      <n-select v-model:value="$route.path" :options="getMainoutRouteOptions" @change="onChange" />
    </div>

    <div class="absolute right-8 top-8 z-50 hstack children:cursor-pointer space-x-4">
      <n-button text>
        <WAppLocalePicker v-if="appStoreBackendSettings.getLocaleEnabled" />
      </n-button>
      <n-button text>
        <WAppDarkMode v-if="appStoreBackendSettings.getDarkEnabled" />
      </n-button>
    </div>
  </div>
</template>
