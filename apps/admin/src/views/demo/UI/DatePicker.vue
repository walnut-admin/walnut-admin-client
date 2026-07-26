<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'

defineOptions({
  name: 'DatePickerDemo',
  defaultView: false,
})

const state = reactive<Recordable>({})
</script>

<template>
  <WDemoCard title="Date Picker">
    <WJSON :value="state" height="80px" />

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic Usage
        </WTitle>

        <WDatePicker v-model:value="state.color1" />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
