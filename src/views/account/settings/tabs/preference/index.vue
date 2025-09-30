<script lang="ts" setup>
import WAccountSettingsTabPreferenceAccessibility from './accessibility.vue'
import WAccountSettingsTabPreferenceBasic from './basic.vue'
import WAccountSettingsTabPreferenceTheme from './theme.vue'

defineOptions({
  name: 'WAccountSettingsTabPreference',
  defaultView: false,
})
</script>

<template>
  <n-tabs
    type="line"
    animated
    placement="left"
    :style=" { height: '240px' }"
  >
    <n-tab-pane name="1" display-directive="show:lazy" tab="Basic">
      <WAccountSettingsTabPreferenceBasic />
    </n-tab-pane>

    <n-tab-pane name="2" display-directive="show:lazy" tab="Accessibility">
      <WAccountSettingsTabPreferenceAccessibility />
    </n-tab-pane>

    <n-tab-pane name="3" display-directive="show:lazy" tab="Theme">
      <WAccountSettingsTabPreferenceTheme />
    </n-tab-pane>

    <n-tab-pane name="4" display-directive="show:lazy" tab="Layout">
      Wonderwall
    </n-tab-pane>
  </n-tabs>
</template>
