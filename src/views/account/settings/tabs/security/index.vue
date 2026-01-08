<script lang="ts" setup>
import WAccountSettingsTabSecurityOpaque from './opaque.vue'

defineOptions({
  name: 'WAccountSettingsTabSecurity',
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
    <n-tab-pane name="1" display-directive="show:lazy" :tab="$t('dict.sys_operate_type.update_password')">
      <WAccountSettingsTabSecurityOpaque />
    </n-tab-pane>

    <!-- <n-tab-pane name="2" display-directive="show:lazy" :tab="$t('app.base.accessibility')">
      123
    </n-tab-pane>

    <n-tab-pane name="3" display-directive="show:lazy" :tab="$t('app.base.theme')">
      321
    </n-tab-pane>

    <n-tab-pane name="4" display-directive="show:lazy" :tab="$t('app.base.layout')">
      222
    </n-tab-pane> -->
  </n-tabs>
</template>
