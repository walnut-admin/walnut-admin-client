<script lang="ts" setup>
import type { WAppFullScreenProps } from '.'

defineOptions({
  name: 'AppFullScreen',
})

withDefaults(defineProps<WAppFullScreenProps>(), {
  size: '28',
})
</script>

<template>
  <div>
    <n-tooltip trigger="hover">
      <template #default>
        {{ isFullscreen ? $t('app.base.minimize') : $t('app.base.maximize') }}
      </template>

      <template #trigger>
        <WIcon
          :icon="
            isFullscreen
              ? 'mdi:fullscreen-exit'
              : 'mdi:fullscreen'
          "
          :width="size"
          @click="clickEvent"
        />
      </template>
    </n-tooltip>
  </div>
</template>
