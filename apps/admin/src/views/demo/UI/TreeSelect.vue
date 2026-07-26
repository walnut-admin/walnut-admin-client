<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'
import { getTreeData } from '../data'

defineOptions({
  name: 'DemoTreeSelect',
  defaultView: false,
})

const state = ref<Recordable>({
  treeSelect1: undefined,
  treeSelect2: [],
  treeSelect3: undefined,
  treeSelect4: [],
})

const id = setTimeout(() => {
  state.value.treeSelect3 = 9
  state.value.treeSelect4 = [1, 4, 9, 11, 12]
  clearTimeout(id)
}, 2000)

const treeSelectProps = {
  options: getTreeData(),
  labelField: '_label',
  keyField: '_id',
}
</script>

<template>
  <WDemoCard
    title="Tree"
    description="1. Only support full data tree
    2. Multiple Check strategy is get what you saw"
  >
    <WJSON :value="state" height="300px" />

    <n-list>
      <n-list-item>
        <n-grid :cols="2" :x-gap="16">
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Single Choose Tree Select
            </WTitle>

            <WTreeSelect v-model:value="state.treeSelect1" :tree-select-props="treeSelectProps" />
          </n-gi>
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Multiple Choose Tree Select
            </WTitle>

            <WTreeSelect v-model:value="state.treeSelect2" :tree-select-props="treeSelectProps" multiple />
          </n-gi>
        </n-grid>
      </n-list-item>

      <n-list-item>
        <n-grid :cols="2" :x-gap="16">
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Single Feedback
            </WTitle>

            <WTreeSelect v-model:value="state.treeSelect3" :tree-select-props="treeSelectProps" />
          </n-gi>
          <n-gi>
            <WTitle prefix="bar" class="mb-2">
              Multiple Feedback
            </WTitle>

            <WTreeSelect v-model:value="state.treeSelect4" :tree-select-props="treeSelectProps" multiple />
          </n-gi>
        </n-grid>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
