<script lang="ts" setup>
const appStoreSettingDev = useAppStoreSettingDev()
const userStorePreference = useAppStoreUserPreference()
</script>

<template>
  <WTransition appear :transition-name="appStoreSettingDev.getFooterTransition">
    <n-layout-footer
      v-if="appStoreSettingDev.getFooterShow"
      :id="appStoreSettingDev.getFooterId"
      bordered
      :inverted="userStorePreference.getFooterInverted"
      :style="{
        zIndex: 999,
        height: `${appStoreSettingDev.getFooterHeight}rem`,
      }"
    >
      <div class="h-full flex items-center justify-center whitespace-nowrap text-sm">
        {{ appStoreSettingDev.getFooterContent }}
      </div>
    </n-layout-footer>
  </WTransition>
</template>
