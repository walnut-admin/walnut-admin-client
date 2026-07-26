<script lang="ts" setup>
defineOptions({
  name: 'DynamicTagsDemo',
  defaultView: false,
})

const state = reactive({
  dynamicTag1: [],
  dynamicTag2: ['1', '2', '3', '4'],
})
</script>

<template>
  <WDemoCard title="Dynamic Tags">
    <WJSON :value="state" height="200px" />

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic usage
        </WTitle>

        <n-space vertical>
          <WDynamicTags v-model:value="state.dynamicTag1" />

          <WDynamicTags v-model:value="state.dynamicTag2" />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
