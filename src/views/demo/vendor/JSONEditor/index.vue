<script lang="ts" setup>
import { name, version } from '~build/package'

defineOptions({
  name: 'JSONEditorDemo',
})

const jsonValue = ref({
  name,
  version,
})
</script>

<template>
  <WDemoCard title="JSON Editor Demo">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic
        </WTitle>

        <WJSON :value="jsonValue" class="mb-2" />

        <WJSONEditor v-model:value="jsonValue" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Readonly
        </WTitle>

        <WJSON :value="jsonValue" class="mb-2" />

        <WJSONEditor v-model:value="jsonValue" read-only />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
