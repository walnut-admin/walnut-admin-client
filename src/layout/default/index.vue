<script lang="ts" setup>
import { useAppLock } from '@/components/App/AppLock/useAppLock'
import TheAppGlobalComponents from './Features/global.vue'
import TheAppWatermark from './Features/watermark.vue'
import { useStarOnGithub } from './hooks/useStarOnGithub'
import TheScrollContent from './scrollContent.vue'
import TheScrollWrapper from './scrollWrapper.vue'

import TheAside from './TheAside'

const appStoreMenu = useAppStoreMenu()
const appStoreSettingDev = useAppStoreSettingDev()
const appSettingScope = useAppStoreSettingScope()
const appStoreAdapter = useAppStoreAdapter()
const appStorePreference = useAppStoreUserPreference()

// lock socket on
const appStoreLock = useAppStoreLock()
appStoreLock.lockFromSocket()

// get preference
appStorePreference.onInitPreference()

// TODO layout
// watchEffect(() => {
//   if (setting.app.layout === AppConstLayoutMode.LEFT_MENU) {
//     setting.app.showLogo = true
//     setting.app.showMenu = true
//     setting.header.showBreadcrumb = true
//   }

//   if (setting.app.layout === AppConstLayoutMode.TOP_MENU) {
//     setting.app.showLogo = false
//     setting.app.showMenu = false
//     setting.header.showBreadcrumb = false
//     appMemo.value.collapse = false
//   }
// })

// P2 layout level hook
useAppIntro()
useAppLock()
useAppContentFull()
useAppTextSelection()
useAppHijackF5()
useStarOnGithub()
</script>

<template>
  <n-layout has-sider>
    <TheAside v-if="appStoreSettingDev.getMenuAdapterStatus" />

    <n-drawer
      v-else
      v-model:show="appStoreMenu.showAside"
      :width="appStoreAdapter.isMobile ? '80vw' : `${appStoreSettingDev.getMenuWidth}rem`"
      placement="left"
      :native-scrollbar="false"
    >
      <TheAside />
    </n-drawer>

    <div
      class="h-screen"
      :style="{ width: `calc(100vw - ${appStoreSettingDev.getMenuWidth}rem)` }"
    >
      <n-layout-content
        bordered
        :native-scrollbar="false"
        :content-style="{ height: '100%' }"
        class="relative h-full w-full"
      >
        <TheScrollContent v-if="appStoreSettingDev.getScrollModeIsContent" />
        <TheScrollWrapper v-else-if="appStoreSettingDev.getScrollModeIsWrapper" />
      </n-layout-content>

      <WAppSettings />
      <TheAppWatermark v-if="appSettingScope.getWatermarkStatus" />
      <TheAppGlobalComponents />
    </div>
  </n-layout>
</template>
