<script lang="ts" setup>
import { options } from '../data'

defineOptions({
  name: 'RadioDemo',
  defaultView: false,
})

const state = reactive({
  radio1: undefined,
  radio2: 1,
  radio3: '1',
})
</script>

<template>
  <WDemoCard title="Radio">
    <WJSON :value="state" height="200px" />

    <n-list>
      <n-list-item>
        <WTitle
          prefix="bar"
          help-message="string/number will all feedback correctly"
        >
          Basic usage
        </WTitle>

        <n-space vertical>
          <WRadio
            v-model:value="state.radio1"
            :options="options"
            value-type="number"
          />

          <WRadio
            v-model:value="state.radio2"
            :options="options"
            size="large"
            value-type="number"
          />
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Button Radio
        </WTitle>

        <WRadio
          v-model:value="state.radio3"
          :options="options"
          button
          value-type="number"
        />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
