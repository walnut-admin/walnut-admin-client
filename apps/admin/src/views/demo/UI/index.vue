<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'DemoUI',
})

const currentComponentDemo = useRouterQuery('c')

const demoOptions: SelectOption[]
  = Object.entries(import.meta.glob('./*.vue', { import: 'default', eager: true }))
    .filter(([key]) => !key.includes('index'))
    .map(([key, value]) => {
      return { value: key, label: key.replace('./', '').replace('.vue', ''), component: value }
    })

const getCurrentComponent = computed(() => demoOptions.find(i => i.value === currentComponentDemo.value)?.component)
</script>

<template>
  <div>
    <WSelect v-model:value="currentComponentDemo" :options="demoOptions" class="w-96" filterable />

    <div class="mt-4">
      <component :is="getCurrentComponent" />
    </div>
  </div>
</template>
