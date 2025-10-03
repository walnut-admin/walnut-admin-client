<script lang="ts" setup>
const appStoreMenu = useAppStoreMenu()
const appStoreSettingDev = useAppStoreSettingDev()

const { title: AppTitle } = useAppEnvTitle()

async function onGoIndex() {
  await appStoreMenu.goIndex()
}
</script>

<template>
  <WTransition appear :transition-name="appStoreSettingDev.getLogoTransition">
    <div
      v-if="appStoreSettingDev.getLogoShow"
      :id="appStoreSettingDev.getLogoId"
      class="cursor-pointer whitespace-nowrap px-6 transition-all" :class="[
        {
          '!pl-4 !px-0': appStoreMenu.getCollapse,
          '!fixed': appStoreSettingDev.getLogoFixed,
        },
      ]"
      :style="{
        height: `${appStoreSettingDev.header.height}px`,
        width: `${appStoreSettingDev.getMenuWidth}px`,
        zIndex: 999,
      }"
      @click="onGoIndex"
    >
      <div class="h-full w-full hstack items-center justify-around">
        <img src="/logo.png" :alt="`${AppTitle} Logo`" class="h-9">

        <WTransition transition-name="zoom-down">
          <div
            v-show="!appStoreMenu.getCollapse"
            class="text-center text-xl font-bold not-italic"
          >
            {{ AppTitle }}
          </div>
        </WTransition>
      </div>
    </div>
  </WTransition>
</template>
