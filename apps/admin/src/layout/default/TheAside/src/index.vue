<script lang="ts" setup>
import MenuCollpaseButton from './collapseButton.vue'
import AsideLogo from './logo.vue'
import AsideMenu from './menu.vue'

const appStoreMenu = useAppStoreMenu()
const appStoreSettingDev = useAppStoreSettingDev()
const userStorePreference = useAppStoreUserPreference()
const appStoreAdapter = useAppStoreAdapter()
</script>

<template>
  <n-layout-sider
    v-model:collapsed="appStoreMenu.collapse"
    bordered
    collapse-mode="width"
    class="z-2000 h-screen"
    :width="appStoreAdapter.isMobile ? '80vw' : `${appStoreSettingDev.getMenuWidth}rem`"
    :collapsed-width="appStoreSettingDev.getMenuCollapsedWidth * userStorePreference.getFontSize"
    :show-trigger="appStoreSettingDev.getMenuCollapseBuiltInStatus"
    :inverted="userStorePreference.getMenuInverted"
    :native-scrollbar="false"
  >
    <div class="select-none overflow-hidden">
      <AsideLogo />

      <AsideMenu />

      <MenuCollpaseButton
        v-if="appStoreSettingDev.getMenuCollapseButtonStatus"
      />
    </div>
  </n-layout-sider>
</template>
