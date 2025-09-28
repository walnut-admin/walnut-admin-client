<script lang="ts" setup>
const appStoreMenu = useAppStoreMenu()
const userStorePreference = useAppStoreUserPreference()

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
      backgroundColor: userStorePreference.getMenuInverted
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
