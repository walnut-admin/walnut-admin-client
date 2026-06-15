<script lang="ts" setup>
import type { ICompBusinessDictProps } from '.'

defineOptions({
  name: 'WCompBusinessDict',
})

const { renderType = 'select', dictType, componentProps } = defineProps<ICompBusinessDictProps>()

const dictValue = defineModel<any>('value', { required: true })

const { t } = useAppI18n()

const { loading, execDict } = useDict(dictType)

const getTOptions = computed(() =>
  getDictDataFromMap(dictType)?.map(i => ({
    label: t(i.label!),
    value: i.value,
  })),
)

async function onInit() {
  if (!dictType) {
    console.warn('WDict', 'need to provide `dictType` prop')
    return
  }
  await execDict()
}

onBeforeMount(onInit)
</script>

<template>
  <n-spin :show="loading" :content-style="{ width: '100% !important' }">
    <!-- @vue-ignore -->
    <WSelect
      v-if="renderType === 'select' && getTOptions?.length"
      v-model:value="dictValue"
      :options="getTOptions"
      v-bind="componentProps"
    />

    <!-- @vue-ignore -->
    <WCheckbox
      v-if="renderType === 'checkbox' && getTOptions?.length"
      v-model:value="dictValue"
      :options="getTOptions"
      v-bind="componentProps"
      multiple
    />

    <!-- @vue-ignore -->
    <WRadio
      v-if="renderType === 'radio' && getTOptions?.length"
      v-model:value="dictValue"
      :options="getTOptions"
      v-bind="componentProps"
    />
  </n-spin>
</template>

<style lang="scss" scoped>
.w-spin-container {
  width: 100% !important;
}
</style>
