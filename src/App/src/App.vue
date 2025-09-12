<script lang="ts" setup>
import GlobalComponents from './compoent/global.vue'
import ThemeProvider from './naive/AppTheme.vue'
import MsgProvider from './naive/MsgProvider.vue'
import UIProvider from './naive/UIProvider.vue'

// regular title
useAppTitle()
// regulat resize
useAppResize()
// custom user monitor based on sendBeacon
useAppUserMonitor()
// reduced motion
useAppReducedMotion()

// get public setting first
const appStoreBackendSettings = useAppStoreSettingBackend()
appStoreBackendSettings.onInitPublicSettings().then(() => {
  // if locale enable
  if (appStoreBackendSettings.getLocaleEnabled) {
    useappStoreLocale()
  }
})
</script>

<template>
  <UIProvider>
    <ThemeProvider>
      <MsgProvider>
        <GlobalComponents />
        <RouterView />
      </MsgProvider>
    </ThemeProvider>
  </UIProvider>
</template>
