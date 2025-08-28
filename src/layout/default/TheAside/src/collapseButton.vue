<script lang="ts" setup>
const appStoreMenu = useAppStoreMenu()
const appStoreSettings = useAppStoreSetting()

function onToogleCollapse() {
  appStoreMenu.setCollapse(!appStoreMenu.getCollapse)
}
</script>

<template>
  <WButton
    type="info"
    text
    size="large"
    class="bg-base-color absolute bottom-0 w-full py-1"
    :style="{
      backgroundColor: appStoreSettings.menu.inverted
        ? 'var(--inverted-color)'
        : 'transparent',
    }"
    :icon="
      appStoreMenu.getCollapse
        ? 'ant-design:double-right-outlined'
        : 'ant-design:double-left-outlined'
    "
    @click="onToogleCollapse"
  />
</template>
