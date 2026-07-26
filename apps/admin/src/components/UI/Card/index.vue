<script lang="ts" setup>
import type { ICompUICardProps } from '.'

defineOptions({
  name: 'WCompUICardProps',
})

defineProps<ICompUICardProps>()

const emits = defineEmits<{ refresh: [] }>()

const show = ref(true)

function onRefresh() {
  emits('refresh')
}
</script>

<template>
  <n-card size="small">
    <template #default>
      <n-collapse-transition v-if="headerPreset === 'collapse'" :show="show" class="px-2">
        <slot />
      </n-collapse-transition>
      <slot v-else />
    </template>

    <template #header-extra>
      <WArrow v-if="headerPreset === 'collapse'" :active="show" @click="show = !show" />
      <WIconButton
        v-else-if="headerPreset === 'refresh'"
        :button-props="{ text: true, disabled: loading, loading, onClick: onRefresh }"
        :icon-props="{ icon: 'ant-design:sync-outlined' }"
        class="cursor-pointer"
      />
      <slot v-else name="header-extra" />
    </template>

    <template #header>
      <slot name="header" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
    <template #action>
      <slot name="action" />
    </template>
  </n-card>
</template>
