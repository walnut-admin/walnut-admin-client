<script lang="ts" setup>
import WAccountSettingsTabPreferenceAccessibility from './accessibility.vue'
import WAccountSettingsTabPreferenceBasic from './basic.vue'
import WAccountSettingsTabPreferenceLayout from './layout.vue'
import WAccountSettingsTabPreferenceTheme from './theme.vue'

defineOptions({
  name: 'WAccountSettingsTabPreference',
  defaultView: false,
})

const activeCTab = defineModel('value', { type: String })
</script>

<template>
  <n-tabs
    v-model:value="activeCTab"
    type="line"
    animated
    placement="left"
  >
    <n-tab-pane name="1" display-directive="show:lazy" :tab="$t('app.base.basic')">
      <WAccountSettingsTabPreferenceBasic />
    </n-tab-pane>

    <n-tab-pane name="2" display-directive="show:lazy" :tab="$t('app.base.accessibility')">
      <WAccountSettingsTabPreferenceAccessibility />
    </n-tab-pane>

    <n-tab-pane name="3" display-directive="show:lazy" :tab="$t('app.base.theme')">
      <WAccountSettingsTabPreferenceTheme />
    </n-tab-pane>

    <n-tab-pane name="4" display-directive="show:lazy" :tab="$t('app.base.layout')">
      <WAccountSettingsTabPreferenceLayout />
    </n-tab-pane>
  </n-tabs>
</template>
