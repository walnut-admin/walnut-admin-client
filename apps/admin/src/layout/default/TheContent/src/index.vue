<script lang="ts" setup>
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'

const appStoreMenu = useAppStoreMenu()
const appStoreSettingDev = useAppStoreSettingDev()
const appSettingScope = useAppStoreSettingScope()

const getKeepAliveInclude = computed(() => {
  if (!appStoreSettingDev.getKeepAlive)
    return []
  return appStoreMenu.getKeepAliveRouteNames
})

function getComponentKey(route: RouteLocationNormalizedLoadedGeneric) {
  const strategy = route.meta?.cacheKeyStrategy

  switch (strategy) {
    case 'name':
      return route.name as string
    case 'path':
      return route.path
    case 'custom':
      // TODO your custom cache key strategy
      return route.fullPath
    default:
      return route.fullPath
  }
}
</script>

<template>
  <Suspense>
    <template #default>
      <router-view v-slot="{ Component, route }">
        <WTransition v-if="appSettingScope.getTransitionStatus" :transition-name="appSettingScope.getTransitionName(route)" mode="out-in" appear>
          <keep-alive
            v-if="appStoreSettingDev.getKeepAlive"
            :include="getKeepAliveInclude"
          >
            <component :is="Component" v-if="localRefreshFlag" :key="getComponentKey(route)" />
          </keep-alive>

          <component :is="Component" v-else :key="getComponentKey(route)" />
        </WTransition>

        <template v-else>
          <keep-alive
            v-if="appStoreSettingDev.getKeepAlive"
            :include="getKeepAliveInclude"
          >
            <component :is="Component" v-if="localRefreshFlag" :key="getComponentKey(route)" />
          </keep-alive>

          <component :is="Component" v-else :key="getComponentKey(route)" />
        </template>
      </router-view>
    </template>

    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
