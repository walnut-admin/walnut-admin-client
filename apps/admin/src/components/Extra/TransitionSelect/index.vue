<script lang="ts" setup>
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

defineOptions({
  name: 'WCompExtraTransitionSelect',
})

const value = defineModel<string | null>('value')

function getChilren(group: string) {
  return Object.entries(AppConstTransitionName)
    .map(([key, value]) => ({
      value,
      label: key,
    }))
    .filter(i => i.value.startsWith(group))
}

const options = ref<SelectMixedOption[]>(
  ['fade', 'zoom', 'bounce', 'rotate', 'slide', 'back', 'flip'].map(
    group => ({
      type: 'group',
      label: group,
      key: `group-${group}`,
      children: getChilren(group),
    }),
  ),
)
</script>

<template>
  <WSelect v-model:value="value!" :options="options" filterable />
</template>
