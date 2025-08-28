<script lang="ts" setup>
const appStoreMenu = useAppStoreMenu()
const appSetting = useAppStoreSetting()

const { title: AppTitle } = useAppEnvTitle()

async function onGoIndex() {
  await appStoreMenu.goIndex()
}
</script>

<template>
  <WTransition appear :transition-name="appSetting.getLogoTransition">
    <div
      v-if="appSetting.getLogoShow"
      :id="appSetting.getLogoId"
      class="cursor-pointer whitespace-nowrap px-6 transition-all" :class="[
        {
          'pl-4 px-0': appStoreMenu.getCollapse,
          'fixed': appSetting.getLogoFixed,
        },
      ]"
      :style="{
        height: `${appSetting.header.height}px`,
        width: `${appSetting.menu.width}px`,
        zIndex: 999,
      }"
      @click="onGoIndex"
    >
      <div class="h-full w-full hstack items-center justify-between">
        <img src="/logo.png" :alt="`${AppTitle} Logo`" class="h-9 w-9">

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
