<script lang="ts" setup>
defineOptions({
  name: 'WAppSettingsExitFullContent',
})

const appStoreSettingDev = useAppStoreSettingDev()

useEventListener('keydown', async (e) => {
  if (e.key === 'Escape') {
    appStoreSettingDev.toggleLayout(true)
  }
})

function onExitFullContent() {
  appStoreSettingDev.toggleLayout(true)
}
</script>

<template>
  <WIconButton
    :icon-props="{
      height: '24',
      icon: 'ant-design:fullscreen-exit-outlined',
    }"
    :button-props="{
      onClick: onExitFullContent,
    }"
    tooltip
    :tooltip-msg="$t('app.settings.tooltip.exitFullContent')"
    :tooltip-props="{
      placement: 'left',
    }"
  />
</template>
