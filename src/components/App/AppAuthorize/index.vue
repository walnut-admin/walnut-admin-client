<script lang="ts" setup>
import type { IAppAuthorizeProps } from '.'
import { createAsyncComponent } from '@/utils/factory/asyncComponent'

defineOptions({
  name: 'AppAuthorize',
})

withDefaults(defineProps<IAppAuthorizeProps>(), {
  preset: 'null',
})

const emits = defineEmits<{ success: [] }>()

const AppAuthorizeIPTC = createAsyncComponent(() => import('./IPTC.vue'))
const AppNotAuthorized = createAsyncComponent(() => import('../AppNotAuthorized'))

const userPermission = useAppStoreUserPermission()

function onSuccess() {
  emits('success')
}
</script>

<template>
  <AppAuthorizeIPTC
    v-if="preset === 'IPTC'"
    :value="value"
    :preset-height="presetHeight"
    :preset-width="presetWidth"
    @success="onSuccess"
  >
    <slot />
  </AppAuthorizeIPTC>
  <slot v-else-if="value && userPermission.hasPermission(value)" />
  <div v-else-if="preset === 'null'" />
  <AppNotAuthorized
    v-else-if="preset === 'tip'"
    :preset-height="presetHeight"
    :preset-width="presetWidth"
  />
</template>
