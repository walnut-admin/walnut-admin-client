<script lang="ts" setup>
import WAccountSettingsTabSecurityOpaque from './opaque.vue'

defineOptions({
  name: 'WAccountSettingsTabSecurity',
  defaultView: false,
})

const activeTab = useRouterQuery('ptab', '1')
</script>

<template>
  <n-tabs
    v-model:value="activeTab"
    type="line"
    animated
    placement="left"
  >
    <n-tab-pane name="1" display-directive="show:lazy" :tab="$t('app.base.pass.update')">
      <WAccountSettingsTabSecurityOpaque />
    </n-tab-pane>

    <!-- <n-tab-pane name="2" display-directive="show:lazy" :tab="$t('app.base.accessibility')">
      <WAccountSettingsTabPreferenceAccessibility />
    </n-tab-pane>

    <n-tab-pane name="3" display-directive="show:lazy" :tab="$t('app.base.theme')">
      <WAccountSettingsTabPreferenceTheme />
    </n-tab-pane>

    <n-tab-pane name="4" display-directive="show:lazy" :tab="$t('app.base.layout')">
      <WAccountSettingsTabPreferenceLayout />
    </n-tab-pane> -->
  </n-tabs>
</template>
