<script lang="ts" setup>
import AppSettingsForm from './component/form/index.vue'
import AppSettingExitFullContent from './component/fullContent.vue'

defineOptions({
  name: 'AppSettings',
})

const appStoreSettingDev = useAppStoreSettingDev()

const contentFull = useRouterQuery('full')
</script>

<template>
  <n-float-button
    position="fixed"
    bottom="120"
    right="60"
    menu-trigger="hover"
    style="z-index:9999"
  >
    <WIcon
      id="walnut-settings"
      height="24"
      icon="ant-design:setting-outlined"
    />

    <template #menu>
      <n-float-button v-if="appStoreSettingDev.getIsLayoutHidden && !contentFull">
        <AppSettingExitFullContent />
      </n-float-button>

      <n-float-button>
        <WDevSettings />
      </n-float-button>

      <n-float-button>
        <AppSettingsForm />
      </n-float-button>
    </template>
  </n-float-button>
</template>
