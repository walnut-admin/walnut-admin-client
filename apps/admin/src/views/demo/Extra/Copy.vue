<script lang="ts" setup>
import { getTreeData } from '../data'

defineOptions({
  name: 'CopyDemo',
  defaultView: false,
})

const source = [...getTreeData()]
</script>

<template>
  <WDemoCard title="Copy button">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          pass stringify data into copy
        </WTitle>

        <WJSON :copy="false" :value="source" height="200px" />

        <WCopy :source="JSON.stringify(source)" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          only icon shown
        </WTitle>

        <WJSON :copy="false" :value="source" height="200px" />

        <WCopy :source="JSON.stringify(source)" icon />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
