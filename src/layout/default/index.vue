<script lang="ts" setup>
import TheAppGlobalComponents from './Features/global.vue'
import TheAppWatermark from './Features/watermark.vue'
import { useStarOnGithub } from './hooks/useStarOnGithub'
import TheScrollContent from './scrollContent.vue'
import TheScrollWrapper from './scrollWrapper.vue'

import TheAside from './TheAside'

const appStoreMenu = useAppStoreMenu()
const appSetting = useAppStoreSetting()

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
useAppContentFull()
useAppTextSelection()
useAppColorMode()
useAppHijackF5()
setupSocket()
useStarOnGithub()

const mainRef = useTemplateRef('mainRef')
function onBackToTop() {
  mainRef.value?.onScrollToTop()
}
</script>

<template>
  <n-layout has-sider>
    <TheAside v-if="appSetting.getMenuAdapterStatus" />

    <n-drawer
      v-else
      v-model:show="appStoreMenu.getShowAside"
      :width="`${appSetting.menu.width}px`"
      placement="left"
      :native-scrollbar="false"
    >
      <TheAside />
    </n-drawer>

    <div
      class="h-screen"
      :style="{ width: `calc(100vw - ${appSetting.getMenuWidth}px)` }"
    >
      <n-layout-content
        bordered
        :native-scrollbar="false"
        :content-style="{ height: '100%' }"
        class="relative h-full w-full"
      >
        <TheScrollContent v-if="appSetting.getScrollModeIsContent" ref="mainRef" />
        <TheScrollWrapper v-else-if="appSetting.getScrollModeIsWrapper" ref="mainRef" />
      </n-layout-content>

      <WAppSettings @back-to-top="onBackToTop" />
      <TheAppWatermark />
      <TheAppGlobalComponents />
    </div>
  </n-layout>
</template>
