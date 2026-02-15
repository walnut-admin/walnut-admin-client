<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'
import { useTree } from '@/components/UI/Tree'
import { getTreeData } from '../data'

defineOptions({
  name: 'DemoTree',
  defaultView: false,
})

const state = ref<Recordable>({
  tree1: undefined,
  tree2: [],
  tree3: undefined,
  tree4: [],
})

const id = setTimeout(() => {
  state.value.tree3 = 9
  state.value.tree4 = [1, 4, 9, 11, 12]
  clearTimeout(id)
}, 2000)

const [register1] = useTree({
  maxHeight: '300px',
  treeProps: {
    data: getTreeData(),
    labelField: '_label',
    keyField: '_id',
  },
})

const [register2] = useTree({
  multiple: true,
  maxHeight: '300px',
  treeProps: {
    data: getTreeData(),
    labelField: '_label',
    keyField: '_id',
  },
})

const [register3] = useTree({
  toolbar: true,

  deletable: true,
  onTreeNodeItemDelete(option) {
    console.log('DemoTree', option)
  },

  maxHeight: '300px',

  treeProps: {
    data: getTreeData(),
    labelField: '_label',
    keyField: '_id',
    blockLine: true,
    blockNode: true,
    showLine: true,
    showIrrelevantNodes: false,
  },
})

const [register4] = useTree({
  multiple: true,
  toolbar: true,
  presetPrefixIcon: true,

  deletable: true,
  onTreeNodeItemDelete(option) {
    console.log('DemoTree', option)
  },

  presetContextMenu: true,
  onPaste: (copy, current) => {
    console.log('DemoTree', { copy, current })
  },
  extraDropdownOptions: [
    {
      key: 'extra',
      label: 'Extra Action',
      onClick: (item) => {
        console.log('DemoTree', { item })
      },
    },
  ],

  treeProps: {
    data: getTreeData(),
    labelField: '_label',
    keyField: '_id',
    blockLine: true,
    blockNode: true,
    draggable: true,
    onDrop: ({ node, dragNode, dropPosition }) => {
      console.log('DemoTree', { node, dragNode, dropPosition })
    },
  },
})
</script>

<template>
  <WDemoCard title="Tree">
    <WJSON :value="state" height="300px" />

    <n-list>
      <n-list-item>
        <n-grid :cols="2">
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Single Choose Tree
            </WTitle>

            <WTree v-model:value="state.tree1" @hook="register1" />
          </n-gi>
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Multiple Choose Tree
            </WTitle>

            <WTree v-model:value="state.tree2" @hook="register2" />
          </n-gi>
        </n-grid>
      </n-list-item>

      <n-list-item>
        <n-grid :cols="2">
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Single Feedback
            </WTitle>

            <WTree v-model:value="state.tree3" @hook="register3" />
          </n-gi>
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Multiple Feedback
            </WTitle>

            <WTree v-model:value="state.tree4" @hook="register4" />
          </n-gi>
        </n-grid>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
