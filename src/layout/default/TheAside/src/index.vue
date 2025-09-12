<script lang="ts" setup>
import MenuCollpaseButton from './collapseButton.vue'
import AsideLogo from './logo.vue'
import AsideMenu from './menu.vue'

const appStoreMenu = useAppStoreMenu()
const appSetting = useAppStoreSetting()
</script>

<template>
  <n-layout-sider
    v-model:collapsed="appStoreMenu.collapse"
    bordered
    collapse-mode="width"
    class="z-2002 h-screen"
    :width="appSetting.menu.width"
    :collapsed-width="appSetting.menu.collapsedWidth"
    :show-trigger="appSetting.getMenuCollapseBuiltInStatus"
    :inverted="appSetting.getMenuInverted"
    :native-scrollbar="false"
  >
    <div class="select-none overflow-hidden">
      <AsideLogo />

      <AsideMenu />

      <MenuCollpaseButton
        v-if="appSetting.getMenuCollapseButtonStatus"
      />
    </div>
  </n-layout-sider>
</template>
