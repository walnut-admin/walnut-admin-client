<script lang="ts" setup>
defineOptions({
  name: 'LocationPickerDemo',
  defaultView: false,
})

const state = ref({
  location1: undefined,
  location2: '126.544844,45.726521',
})
</script>

<template>
  <WDemoCard title="Location Picker based on baidu map">
    <WJSON :value="state" />

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic usage
        </WTitle>

        <WLocationPicker v-model:value="state.location1" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Feedback
        </WTitle>

        <WLocationPicker v-model:value="state.location2" />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
