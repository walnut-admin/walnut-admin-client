<script lang="ts" setup>
import WAccountSettingsTabSecurityTab1 from './tab1/index.vue'
import WAccountSettingsTabSecurityTab2 from './tab2/index.vue'
import WAccountSettingsTabSecurityTab3 from './tab3/index.vue'
import WAccountSettingsTabSecurityTab4 from './tab4/index.vue'

defineOptions({
  name: 'WMeTabSecurity',
  defaultView: false,
})

const activeCTab = defineModel('value', { type: String })
</script>

<template>
  <n-tabs v-model:value="activeCTab" type="line" animated placement="left">
    <n-tab-pane name="1" display-directive="show:lazy" :tab="$t('app.security.tab1')">
      <WAccountSettingsTabSecurityTab1 />
    </n-tab-pane>

    <n-tab-pane name="2" display-directive="show:lazy" :tab="$t('app.security.tab2')">
      <WAccountSettingsTabSecurityTab2 />
    </n-tab-pane>

    <n-tab-pane name="3" display-directive="show:lazy" :tab="$t('app.security.tab3')">
      <WAccountSettingsTabSecurityTab3 />
    </n-tab-pane>

    <n-tab-pane name="4" display-directive="show:lazy" :tab="$t('app.security.tab4')">
      <WAccountSettingsTabSecurityTab4 />
    </n-tab-pane>
  </n-tabs>
</template>
