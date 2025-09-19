<script lang="ts" setup>
import HeaderBreadCrumb from './breadcrumb.vue'
import HeaderCollapse from './collapse.vue'
import HeaderDropdown from './dropdown.vue'

const appSetting = useAppStoreSetting()
const appStoreAdapter = useAppStoreAdapter()
const appStoreMenu = useAppStoreMenu()
const appStoreBackendSettings = useAppStoreSettingBackend()

const { title: AppTitle } = useAppEnvTitle()

const { isFullscreen, toggle } = useFullscreen()

function onShowAside() {
  appStoreMenu.setShowAside(true)
}
</script>

<template>
  <WTransition appear :transition-name="appSetting.getHeaderTransition">
    <n-layout-header
      v-if="appSetting.getHeaderShow"
      :id="appSetting.getHeaderId"
      bordered
      :inverted="appSetting.getHeaderInverted"
      :style="{
        zIndex: 999,
        height: `${appSetting.header.height}px`,
      }"
    >
      <div
        class="h-full h-full hstack select-none items-center justify-between px-2"
      >
        <!-- left -->
        <div class="hstack items-center justify-between space-x-2">
          <img
            v-if="appStoreAdapter.isMobile"
            src="/logo.png"
            :alt="`${AppTitle} Logo`"
            class="m-1 h-9 w-9"
            @click="onShowAside"
          >

          <template v-else>
            <HeaderCollapse />

            <HeaderBreadCrumb />
          </template>
        </div>

        <!-- right -->
        <div
          class="h-full hstack justify-end children:(h-full flex cursor-pointer items-center px-0.5) space-x-2"
          :class="[
            { 'space-x-1': appStoreAdapter.isMobile },
          ]"
        >
          <WAppFullScreen
            v-if="appStoreBackendSettings.getFullScreenEnabled && !appStoreAdapter.isMobile && appSetting.header.fullscreen"
            id="walnut-fullscreen"
            :is-fullscreen="isFullscreen"
            :click-event="toggle"
          />

          <WAppLock v-if="appSetting.getLockStatus" id="walnut-lock" />

          <WAppSearch
            v-if="appStoreBackendSettings.getSearchEnabled && appSetting.header.search"
            id="walnut-search"
          />

          <WAppLocalePicker v-if="appStoreBackendSettings.getLocaleEnabled" id="walnut-locale" />

          <WAppDarkMode v-if="appStoreBackendSettings.getDarkEnabled" id="walnut-dark" />

          <WDevSettings />

          <HeaderDropdown />
        </div>
      </div>
    </n-layout-header>
  </WTransition>
</template>
