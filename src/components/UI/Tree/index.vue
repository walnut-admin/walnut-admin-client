<script lang="tsx" setup generic="T extends Record<string, any>">
import type { StringOrNumber, TreeNodeItem } from 'easy-fns-ts'
import type { DropdownOption, TreeInst, TreeOption } from 'naive-ui'

import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import type { TreeNodeProps, TreeRenderProps } from 'naive-ui/es/tree/src/interface'

import type { ICompUITreeInst, ICompUITreeProps } from '.'
// TODO 111
import WTransition from '@/components/Extra/Transition'
import { useDropdown } from '@/components/UI/Dropdown'
import WIcon from '@/components/UI/Icon'

import WIconButton from '@/components/UI/IconButton'
import { findPath, formatTree, treeToArr } from 'easy-fns-ts'

import { cloneDeep } from 'lodash-es'

defineOptions({
  name: 'WCompUITree',
  inheritAttrs: false,
})

const props = defineProps<ICompUITreeProps<T>>()

const emits = defineEmits<{ hook: [inst: ICompUITreeInst<T>] }>()

type TreeKey = StringOrNumber

const value = defineModel<TreeKey | TreeKey[]>('value')

const { t } = useAppI18n()

const { setProps, getProps } = useProps<ICompUITreeProps<T>>(props)

const userStorePermission = useAppStoreUserPermission()

const nTreeRef = useTemplateRef<TreeInst>('nTreeRef')
const selectedKeys = ref<TreeKey[]>([])
const checkedKeys = ref<TreeKey[]>([])
const indeterminateKeys = ref<TreeKey[]>([])
const expandedKeys = ref<TreeKey[]>()
const pattern = ref<string>()
const expandAll = ref<boolean>(false)
const checkAll = ref<boolean>(false)
const cascade = ref<boolean>(true)
const copyTarget = ref<T>({} as T)
const currentTarget = ref<T>({} as T)

const getToolBarOptions = computed((): DropdownOption[] => [
  {
    type: 'group',
    label: 'Tree',
    key: 'treeAction',
    children: [
      {
        key: 'expand',
        label: t('app.base.expand'),
        icon: () => (
          <WIcon height="20" icon="mdi:arrow-expand-vertical"></WIcon>
        ),
        disabled: expandAll.value,
      },

      {
        key: 'collapse',
        label: t('app.base.collapse'),
        icon: () => (
          <WIcon height="20" icon="mdi:arrow-collapse-vertical"></WIcon>
        ),
        disabled: !expandAll.value,
      },
    ],
  },

  {
    type: 'group',
    label: 'Node',
    key: 'NodeAction',
    show: getProps.value.multiple,
    children: [
      {
        key: 'check',
        label: t('app.base.check'),
        icon: () => <WIcon height="20" icon="mdi:select-all"></WIcon>,
        disabled: checkAll.value || !getProps.value.multiple,
      },
      {
        key: 'inverse',
        label: t('app.base.inverse'),
        icon: () => <WIcon height="20" icon="mdi:select-inverse"></WIcon>,
        disabled: !checkAll.value || !getProps.value.multiple,
      },
    ],
  },

  {
    type: 'group',
    label: 'Cascade',
    key: 'CascadeAction',
    show: getProps.value.multiple,
    children: [
      {
        key: 'cascade',
        label: t('app.base.cascade'),
        icon: () => (
          <WIcon height="20" icon="carbon:checkbox-indeterminate"></WIcon>
        ),
        disabled:
          !getProps.value.multiple || cascade.value,
      },
      {
        key: 'independent',
        label: t('app.base.independent'),
        icon: () => (
          <WIcon height="20" icon="carbon:checkbox-checked"></WIcon>
        ),
        disabled:
          !getProps.value.multiple || !cascade.value,
      },
    ],
  },
])

const getKeyField = computed((): string => getProps.value.treeProps?.keyField as string)
const getTreeData = computed((): TreeNodeItem<T>[] => getProps.value.treeProps?.data as TreeNodeItem<T>[])

const contextMenuOptions = computed<DropdownMixedOption[]>(() => [
  {
    key: 'copy',
    label: t('app.base.copy'),
    disabled: !!copyTarget.value[getKeyField.value],
    icon: () => <WIcon height="20" icon="mdi:content-copy"></WIcon>,
  },
  {
    key: 'paste',
    label: t('app.base.paste'),
    disabled: !copyTarget.value[getKeyField.value],
    icon: () => <WIcon height="20" icon="mdi:content-paste"></WIcon>,
  },
])

const getCombinedKeys = computed(() => checkedKeys.value.concat(indeterminateKeys.value))

const getBottomChildKeys = computed(() => {
  const res: TreeKey[] = []

  formatTree(getTreeData.value, (node) => {
    if (!node[getProps.value.treeProps?.childrenField || 'children'])
      res.push(node[getKeyField.value] as string)
    return true
  })

  return res
})

const [registerDropdown, { openDropdown, closeDropdown }] = useDropdown({
  dropdownProps: {
    // @ts-expect-error don't know why
    options: contextMenuOptions,
    disabled: getProps.value.treeProps?.disabled,
    onSelect: (key) => {
      if (key === 'copy')
        copyTarget.value = cloneDeep(toRaw(currentTarget.value))

      if (key === 'paste') {
        getProps.value.onPaste!(
          toRaw(copyTarget.value),
          toRaw(currentTarget.value),
        )

        nextTick(() => {
          copyTarget.value = {}
        })
      }

      closeDropdown()
    },
  },
})

function onSelectedKeys(keys: TreeKey[]) {
  selectedKeys.value = keys
  if (!getProps.value.multiple)
    value.value = keys[0]
}

function onCheckedKeys(keys: TreeKey[]) {
  checkedKeys.value = keys
  if (getProps.value.multiple)
    value.value = getCombinedKeys.value as TreeKey[]
}

function onUpdateIndeterminateKeys(keys: TreeKey[]) {
  indeterminateKeys.value = keys
  if (getProps.value.multiple)
    value.value = getCombinedKeys.value as TreeKey[]
}

function onToolbarSelect(key: string) {
  if (key === 'expand') {
    expandedKeys.value = treeToArr(
      getTreeData.value,
    ).map(i => i[getKeyField.value]) as string[]

    expandAll.value = true
  }

  if (key === 'collapse') {
    expandedKeys.value = []

    expandAll.value = false
  }

  if (key === 'check') {
    checkedKeys.value = treeToArr(
      getTreeData.value,
    ).map(i => i[getKeyField.value]) as string[]

    checkAll.value = true

    // in cascade mode, check all need to clear indeterminate keys
    if (cascade.value) {
      indeterminateKeys.value = []
    }

    onCheckedKeys(checkedKeys.value)
  }

  if (key === 'inverse') {
    checkedKeys.value = []

    checkAll.value = false

    onCheckedKeys(checkedKeys.value)
  }

  if (key === 'cascade') {
    checkedKeys.value = []
    indeterminateKeys.value = []

    cascade.value = true

    onFeedback()

    onCheckedKeys(checkedKeys.value)
  }

  if (key === 'independent') {
    checkedKeys.value = []
    indeterminateKeys.value = []

    cascade.value = false

    onFeedback()

    onCheckedKeys(checkedKeys.value)
  }
}

function nodeProps({ option }: { option: TreeOption }): ReturnType<TreeNodeProps> {
  return {
    onContextmenu: getProps.value.presetContextMenu
      ? (e: MouseEvent) => {
          e.preventDefault()
          currentTarget.value = option
          openDropdown(e)
        }
      : undefined,
  }
}

function onRenderPrefix({ option }: TreeRenderProps) {
  return getProps.value.presetPrefixIcon && option.icon
    ? (
        <WIcon icon={option.icon as string} height="18"></WIcon>
      )
    : undefined
}

function onRenderSuffix({ option }: TreeRenderProps) {
  if (selectedKeys.value[0] !== option[getKeyField.value])
    return undefined

  return (getProps.value.treeProps?.draggable || getProps.value.deletable)
    ? (
        <WTransition transition-name="fade-right">
          <div
            class="flex flex-row flex-nowrap items-center justify-center gap-x-1"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {getProps.value.treeProps!.draggable
              && userStorePermission.hasPermission(getProps.value.auths?.update as string) && (
              <WIcon
                height="18"
                class="cursor-move"
                icon="ant-design:drag-outlined"
              >
              </WIcon>
            )}

            {getProps.value.deletable
              && userStorePermission.hasPermission(getProps.value.auths?.delete as string) && (
              <WIconButton
                icon-props={{
                  icon: 'ant-design:delete-outlined',
                }}
                button-props={{
                  type: 'error',
                  disabled: getProps.value.treeProps?.disabled,
                }}
                tooltip
                tooltipMsg={t('app.base.delete')}
                confirm
                onConfirm={() => {
                  getProps.value.onTreeNodeItemDelete!(toRaw(option) as T)
                  if (getProps.value.multiple) {
                    selectedKeys.value = []
                  }
                }}
              >
              </WIconButton>
            )}
          </div>
        </WTransition>
      )
    : undefined
}

async function onFeedback() {
  if (getProps.value.multiple && Array.isArray(value.value)) {
    if (cascade.value) {
      checkedKeys.value = (value.value)?.filter(i => getBottomChildKeys.value.includes(i))
      indeterminateKeys.value = (value.value)?.filter(i => !getBottomChildKeys.value.includes(i))

      await nextTick()

      if (nTreeRef.value) {
        checkedKeys.value = nTreeRef.value.getCheckedData().keys!
        indeterminateKeys.value = nTreeRef.value.getIndeterminateData().keys!
      }
    }
    else { checkedKeys.value = value.value }

    if (getTreeData.value) {
      // expanded keys
      const data = nTreeRef.value?.getCheckedData()
      // get no children node
      const leafNodeKeyList = data?.options.filter(i => !i!.children || i!.children.length === 0).map(i => i![getKeyField.value])
      const intersection = Array.from(new Set(leafNodeKeyList).intersection(new Set(value.value)))
      const allNodes = new Set<TreeKey>([...intersection.map(i => findPath(getTreeData.value!, n => n[getKeyField.value] === i) ?? []).flat().map(i => i[getKeyField.value] as TreeKey)])
      expandedKeys.value = Array.from(allNodes)
    }
  }
  else {
    selectedKeys.value = [value.value] as TreeKey[]

    if (getTreeData.value) {
      // expanded keys
      const targetNodeSingleTree = findPath(getTreeData.value, n => n[getKeyField.value] === value.value) as [] ?? []
      expandedKeys.value = targetNodeSingleTree.map(i => i[getKeyField.value])
    }
  }
}

watch(
  () => value.value,
  async () => {
    await onFeedback()
  },
  {
    immediate: true,
    deep: true,
  },
)

emits('hook', { setProps })

defineExpose({
  setProps,
})
</script>

<template>
  <div class="w-full">
    <div
      v-if="getProps.toolbar"
      class="mb-2 px-2"
    >
      <n-input
        v-model:value="pattern"
        clearable
        :disabled="getProps.treeProps?.disabled"
      >
        <template #suffix>
          <n-dropdown
            trigger="click"
            :options="getToolBarOptions"
            show-arrow size="small"
            :disabled="getProps.treeProps?.disabled"
            @select="onToolbarSelect"
          >
            <WIcon height="20" icon="ant-design:more-outlined" class="cursor-pointer" />
          </n-dropdown>
        </template>
      </n-input>
    </div>

    <WScrollbar :height="getProps.maxHeight ?? 'auto'">
      <n-tree
        ref="nTreeRef"
        v-bind="getProps.treeProps"
        v-model:expanded-keys="expandedKeys"
        :default-expanded-keys="expandedKeys"
        :style="{ height: getProps.maxHeight }"
        :selected-keys="selectedKeys"
        :checked-keys="checkedKeys"
        :indeterminate-keys="indeterminateKeys"
        :cascade="cascade"
        :checkable="getProps.multiple"
        :pattern="pattern"
        :node-props="nodeProps"
        :render-prefix="onRenderPrefix"
        :render-suffix="onRenderSuffix"
        @update:selected-keys="onSelectedKeys"
        @update:checked-keys="onCheckedKeys"
        @update:indeterminate-keys="onUpdateIndeterminateKeys"
      />
    </WScrollbar>

    <WDropdown @hook="registerDropdown" />
  </div>
</template>
