<script lang="ts" setup generic="T">
import type { Recordable, StringOrNumber, TreeNodeItem } from 'easy-fns-ts'
import type { TreeSelectInst } from 'naive-ui'
import type { ICompUITreeSelectProps } from '.'
import { findPath } from 'easy-fns-ts'

defineOptions({
  name: 'Name',
})

const { treeSelectProps, multiple = false } = defineProps<ICompUITreeSelectProps>()

type TreeKey = StringOrNumber

const value = defineModel<TreeKey | TreeKey[]>('value')

const internalValue = ref<TreeKey | TreeKey[] | null>()

const nTreeSelctRef = useTemplateRef<TreeSelectInst>('nTreeSelctRef')

const expandedKeys = ref<TreeKey[]>()
const indeterminateKeys = ref<TreeKey[]>()

const getTreeKeyField = computed(() => treeSelectProps?.keyField)
const getTreeOptions = computed((): TreeNodeItem<T>[] => treeSelectProps?.options as unknown as TreeNodeItem<T>[])

async function onUpdateValue(keys: TreeKey | TreeKey[]) {
  if (multiple && Array.isArray(keys)) {
    await nextTick()

    internalValue.value = keys
    value.value = keys.concat(indeterminateKeys.value!)
  }
  else {
    internalValue.value = keys
    value.value = keys
  }
}

async function onFeedback() {
  if (multiple) {
    if (!Array.isArray(value.value) || !value.value.length)
      return

    // internal value
    internalValue.value = value.value

    await nextTick()

    // expanded keys
    const data = nTreeSelctRef.value?.getCheckedData()
    // get no children node
    const leafNodeKeyList = data?.options.filter(i => !i!.children || i!.children.length === 0).map(i => i![getTreeKeyField.value!])
    const intersection = Array.from(new Set(leafNodeKeyList).intersection(new Set(internalValue.value)))
    internalValue.value = intersection

    const allNodes = new Set<TreeKey>([...internalValue.value.map(i => findPath(getTreeOptions.value!, (n: Recordable) => n[getTreeKeyField.value!] === i) ?? []).flat().map(i => i[getTreeKeyField.value!])])
    expandedKeys.value = Array.from(allNodes)
  }
  else {
    if (!value.value) {
      internalValue.value = null
      expandedKeys.value = []
      return
    }

    // internal value
    internalValue.value = value.value

    // expanded keys
    const targetNodeSingleTree = findPath(getTreeOptions.value!, (n: Recordable) => n[getTreeKeyField.value!] === internalValue.value) as [] ?? []
    expandedKeys.value = targetNodeSingleTree.map(i => i[getTreeKeyField.value!])
  }
}

watch(
  () => value.value,
  async () => {
    await nextTick()
    await onFeedback()
  },
)

onMounted(onFeedback)

defineExpose({})
</script>

<template>
  <n-tree-select
    ref="nTreeSelctRef"
    v-model:expanded-keys="expandedKeys"
    v-model:indeterminate-keys="indeterminateKeys"
    :value="internalValue"
    :multiple="multiple"
    :cascade="multiple"
    :checkable="multiple"
    v-bind="treeSelectProps"
    @update:value="onUpdateValue"
  />
</template>
