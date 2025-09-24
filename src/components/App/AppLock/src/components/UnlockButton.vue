<script lang="ts" setup>
defineOptions({
  name: 'WAppLockUnlockButton',
})

const appStoreLock = useAppStoreLock()

async function onUnlock() {
  await appStoreLock.unLock()
}
</script>

<template>
  <WIconButton
    :icon-props="{ icon: 'ant-design:unlock-outlined', height: 24 }"
    :button-props="{ disabled: appStoreLock.getLoading, onClick: onUnlock, class: 'absolute left-1/2 top-8 -translate-x-1/2' }"
  />
</template>
