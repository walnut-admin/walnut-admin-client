<script lang="ts" setup>
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
    <n-tab-pane name="1" display-directive="show" tab="Accessibility">
      Wonderwall
    </n-tab-pane>

    <n-tab-pane name="2" display-directive="show" tab="Theme">
      Wonderwall
    </n-tab-pane>

    <n-tab-pane name="3" display-directive="show" tab="Layout">
      Wonderwall
    </n-tab-pane>
  </n-tabs>
</template>
