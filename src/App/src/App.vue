<script lang="ts" setup>
import { useAppLock } from '@/components/App/AppLock/useAppLock'

import GlobalComponents from './global/index.vue'
import ThemeProvider from './naive/AppTheme.vue'
import MsgProvider from './naive/MsgProvider.vue'
import UIProvider from './naive/UIProvider.vue'

// regular title
useAppTitle()
// regulat resize
useAppResize()

// TODO lock settings
useAppLock()

// custom user monitor based on sendBeacon
useAppUserMonitor()

// TODO reduced motion, user-prefer
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
