<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'
import { options } from '../data'

defineOptions({
  name: 'CheckboxDemo',
  defaultView: false,
})

const state = ref<Recordable>({
  checkbox1: [],
  checkbox2: [1, 4],
  checkbox3: ['1', '4'],
  checkbox4: '',
  checkbox5: '1,4',
  checkbox6: '1,3,4,5',
})
</script>

<template>
  <WDemoCard title="Checkbox">
    <WJSON :value="state" height="300px" />

    <n-list>
      <n-list-item>
        <WTitle
          prefix="bar"
          help-message="string/number will all feedback correctly"
        >
          Basic usage
        </WTitle>

        <n-space vertical>
          <WCheckbox
            v-model:value="state.checkbox1"
            :options="options"
            value-type="number"
            multiple
          />

          <WCheckbox
            v-model:value="state.checkbox2"
            :options="options"
            value-type="number"
            multiple
          />

          <WCheckbox
            v-model:value="state.checkbox3"
            :options="options"
            value-type="number"
            multiple
          />
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle
          prefix="bar"
          help-message="provide a `value-separator` prop to use checkbox with a string value"
        >
          String v-model:value
        </WTitle>

        <n-space vertical>
          <WCheckbox
            v-model:value="state.checkbox4"
            :options="options"
            value-type="number"
            value-separator=","
            multiple
          />

          <WCheckbox
            v-model:value="state.checkbox5"
            :options="options"
            value-type="number"
            value-separator=","
            multiple
          />

          <WCheckbox
            v-model:value="state.checkbox6"
            :options="options"
            value-type="number"
            value-separator=","
            multiple
          />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
