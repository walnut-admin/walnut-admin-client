<script lang="ts" setup>
import type { TreeNodeItem } from 'easy-fns-ts'
import type { CascaderOption } from 'naive-ui'
import type { ICompBusinessAreaCascaderProps } from '.'
import type { IModels } from '@/api/models'
import {
  getAreaChildrenByPcodeAPI,
  getAreaFeedbackByCodeAPI,
} from '@/api/shared/area'

defineOptions({
  name: 'WCompBusinessAreaCascader',
})

const { depth = 4, showPath = true, multiple = false } = defineProps<ICompBusinessAreaCascaderProps>()

const value = defineModel<string | string[] | null>('value', { required: true })

const options = ref<TreeNodeItem<IModels.SharedArea>[]>([])

async function onLoad(option: CascaderOption) {
  const res = await getAreaChildrenByPcodeAPI(option.code as string)
  option.children = res.map(i => ({
    ...i,
    depth: (option.depth as number) + 1,
    isLeaf: (option.depth as number) + 1 === depth,
  }))
}

async function onInit() {
  const res = await getAreaChildrenByPcodeAPI()
  options.value = res.map(i => ({
    ...i,
    isLeaf: depth === 0,
    depth: 0,
  }))
}

async function onFeedback() {
  if (!value.value || value.value.length === 0)
    return

  // single feedback
  if (!multiple && typeof value.value === 'string') {
    const feedback = await getAreaFeedbackByCodeAPI(value.value)

    options.value = feedback
  }

  // multiple feedback
  if (
    multiple
    && Array.isArray(value.value)
  ) {
    const feedbacks = await getAreaFeedbackByCodeAPI(value.value.join(','))

    options.value = feedbacks
  }
}

onBeforeMount(async () => {
  await onInit()
  await onFeedback()
})
</script>

<template>
  <n-cascader
    v-model:value="value"
    :options="options"
    :show-path="showPath"
    :multiple="multiple"
    clearable
    label-field="name"
    value-field="code"
    remote
    max-tag-count="responsive"
    check-strategy="child"
    :on-load="onLoad"
  />
</template>
