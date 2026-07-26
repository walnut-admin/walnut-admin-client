<script lang="ts" setup>
import { getTreeData } from '../data'

defineOptions({
  name: 'JSONDemo',
  defaultView: false,
})
</script>

<template>
  <WDemoCard title="JSON data display">
    <WJSON :value="getTreeData()" height="400px" />
  </WDemoCard>
</template>
