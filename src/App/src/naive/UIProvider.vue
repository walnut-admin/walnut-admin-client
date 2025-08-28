<script lang="ts" setup>
// notice that `cls-preifx` is not recommended to change
// the reason is that there are some class-selectors which starts with `.w-` influence the style
import { hljs } from './src/hljs'
import { getDateLocale, getLocale } from './src/locale'
import { getTheme, getThemeOverrides } from './src/theme'

defineOptions({
  name: 'UIProvider',
})

const appStoreNaive = useAppStoreNaive()
</script>

<template>
  <n-config-provider
    :hljs="hljs"
    :theme="getTheme"
    :theme-overrides="getThemeOverrides"
    :locale="getLocale"
    :date-locale="getDateLocale"
    inline-theme-disabled
    cls-prefix="w"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider
          :max="appStoreNaive.getNotiMax"
          :placement="appStoreNaive.getNotiPlacement"
          :container-style="appStoreNaive.getNotiContainerStyle"
        >
          <n-message-provider
            :max="appStoreNaive.getMsgMax"
            :placement="appStoreNaive.getMsgPlacement"
          >
            <slot />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
