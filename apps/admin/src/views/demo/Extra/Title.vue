<script lang="ts" setup>
defineOptions({
  name: 'TitleDemo',
  defaultView: false,
})
</script>

<template>
  <WDemoCard title="Basic Title">
    <n-space size="small" vertical>
      <WTitle>This is a normal title.</WTitle>

      <WTitle help-message="This is a help message.">
        This is a title with a help message.
      </WTitle>

      <WTitle prefix="bar" class="mb-2">
        This is a title with state.
      </WTitle>
      <WTitle prefix="bar" type="info">
        This is a title with state.
      </WTitle>
      <WTitle prefix="bar" type="error">
        This is a title with state.
      </WTitle>
      <WTitle prefix="bar" type="warning">
        This is a title with state.
      </WTitle>
    </n-space>
  </WDemoCard>
</template>
