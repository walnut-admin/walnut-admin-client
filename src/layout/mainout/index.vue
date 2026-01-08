<script lang="ts" setup>
defineOptions({
  name: 'Mainout',
})

const appStoreBackendSettings = useAppStoreSettingBackend()
</script>

<template>
  <div class="relative h-screen w-screen flex items-center justify-center bg-bodyColor text-base">
    <router-view />

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
