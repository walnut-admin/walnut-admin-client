<script lang="ts" setup>
import GlobalComponents from './compoent/global.vue'
import { useAppHooks } from './hooks'
import ThemeProvider from './naive/AppTheme.vue'
import MsgProvider from './naive/MsgProvider.vue'
import UIProvider from './naive/UIProvider.vue'

// app hooks
useAppHooks()

// get public setting first
const appStoreBackendSettings = useAppStoreSettingBackend()
// get user preference
const appStorePreference = useAppStoreUserPreference()

onBeforeMount(() => {
  appStoreBackendSettings.onInitPublicSettings()
  appStorePreference.onInitPreference()
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
