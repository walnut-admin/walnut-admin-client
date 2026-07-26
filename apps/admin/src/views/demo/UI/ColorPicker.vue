<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'

defineOptions({
  name: 'ColorPickerDemo',
  defaultView: false,
})

const state = reactive<Recordable>({})
</script>

<template>
  <WDemoCard title="Color Picker">
    <WJSON :value="state" height="80px" />

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic Usage
        </WTitle>

        <WColorPicker v-model:value="state.color1" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Eyedropper support
        </WTitle>

        <WColorPicker v-model:value="state.color2" eye-dropper />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
