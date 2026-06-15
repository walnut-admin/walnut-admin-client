<script lang="ts" setup>
defineOptions({
  name: 'IconPickerDemo',
  defaultView: false,
})
const icon = ref()
const icon2 = ref('carbon:collapse-all')
const icon3 = ref('emojione-v1:flag-for-china')
</script>

<template>
  <WDemoCard title="Icon Picker">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          【{{ icon }}】
        </WTitle>

        <WIconPicker v-model:value="icon" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          【{{ icon2 }}】
        </WTitle>

        <WIconPicker v-model:value="icon2" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          【{{ icon3 }}】
        </WTitle>

        <WIconPicker v-model:value="icon3" preset="icon" />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
