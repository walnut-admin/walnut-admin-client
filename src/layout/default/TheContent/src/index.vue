<script lang="ts" setup>
const appStoreMenu = useAppStoreMenu()
const appSetting = useAppStoreSetting()

const getKeepAliveInclude = computed(() => {
  if (!appSetting.app.keepAlive)
    return []
  return appStoreMenu.getKeepAliveRouteNames
})
</script>

<template>
  <Suspense>
    <template #default>
      <router-view v-slot="{ Component, route }">
        <WTransition v-if="appSetting.getTransition" :transition-name="appSetting.getTransition" mode="out-in" appear>
          <keep-alive
            v-if="appSetting.app.keepAlive"
            :include="getKeepAliveInclude"
          >
            <component :is="Component" v-if="localRefreshFlag" :key="route.path + JSON.stringify(route.params)" />
          </keep-alive>

          <component :is="Component" v-else :key="route.path + JSON.stringify(route.params)" />
        </WTransition>

        <template v-else>
          <keep-alive
            v-if="appSetting.app.keepAlive"
            :include="getKeepAliveInclude"
          >
            <component :is="Component" v-if="localRefreshFlag" :key="route.path + JSON.stringify(route.params)" />
          </keep-alive>

          <component :is="Component" v-else :key="route.path + JSON.stringify(route.params)" />
        </template>
      </router-view>
    </template>

    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
