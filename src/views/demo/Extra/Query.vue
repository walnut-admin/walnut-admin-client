<script lang="ts" setup>
defineOptions({
  name: 'QueryDemo',
  defaultView: false,
})

const q1 = useRouterQuery('q1', '1111')
const q2 = useRouterQuery('q2')
const q3 = useRouterQuery('q3')
</script>

<template>
  <WDemoCard title="Arrow">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Dynamic Query
        </WTitle>

        <n-space>
          <n-input v-model:value="q1" />
          <n-input v-model:value="q2" />
          <n-input v-model:value="q3" />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
