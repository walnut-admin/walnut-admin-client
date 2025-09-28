<script lang="ts" setup>
defineOptions({
  name: 'WAppSettingsBackToTop',
})

const emits = defineEmits<{ backToTop: [] }>()

function onBackTopTop() {
  emits('backToTop')
}
</script>

<template>
  <WIconButton
    :icon-props="{
      height: '24',
      icon: 'ant-design:arrow-up-outlined',
    }"
    :button-props="{
      onClick: onBackTopTop,
    }"
    tooltip
    :tooltip-msg="$t('app.base.backToTop')"
    :tooltip-props="{
      placement: 'left',
    }"
  />
</template>
