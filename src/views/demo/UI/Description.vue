<script lang="ts" setup>
import type { ICompUIDescriptionsItem } from '@/components/UI/Descriptions'

defineOptions({
  name: 'DescriptionDemo',
  defaultView: false,
})

const descs: ICompUIDescriptionsItem[] = [
  {
    key: '0',
    type: 'tag',
    typeProps: {
      type: 'primary',
      round: true,
    },
    copy: true,
    label: 'Tag Label 1',
    value: 'tag value 1',
  },
  {
    key: '1',
    type: 'tag',
    typeProps: {
      type: 'info',
      strong: true,
      size: 'large',
    },
    label: 'Tag Label 2',
    value: 'tag value 2',
  },

  {
    key: '2',
    type: 'link',
    typeProps: {
      type: 'error',
      link: 'https://www.bing.com',
      strong: true,
    },
    copy: true,
    label: 'Link Label 1',
    value: 'click to bing.com',
  },
  {
    key: '3',
    type: 'link',
    typeProps: {
      type: 'warning',
      link: 'https://www.bing.com',
      strong: true,
    },
    copy: true,
    label: 'Link Label 2',
    value: 'click to bing.com',
  },

  {
    key: '4',
    type: 'json',
    typeProps: {
      height: '100px',
      copy: false,
    },
    label: 'JSON label 1',
    value: JSON.stringify({
      v1: 'v1',
      v2: 'v2',
      v3: 'v3',
    }),
  },

  {
    key: '5',
    type: 'json',
    typeProps: {
      height: '100px',
    },
    label: 'JSON label 2',
    value: JSON.stringify({
      v1: 'v1',
      v2: 'v2',
      v3: 'v3',
    }),
  },

  {
    key: '6',
    type: 'dict',
    typeProps: {
      dictType: 'gbt_sex',
    },
    copy: true,
    label: 'Dict label 1',
    value: '1',
  },
  {
    key: '7',
    type: 'dict',
    typeProps: {
      dictType: 'sys_shared_status',
    },
    label: 'Dict label 2',
    value: true,
    copy: true,
    labelClass: 'text-red',
    contentClass: 'my-2',
  },

  {
    key: '8',
    label: 'Normal Label 1',
    value: 'normal value 1',
    copy: true,
  },

  {
    key: '9',
    label: 'Normal Label 2',
    value: 'normal value 2',
    copy: true,
    formatter(val, record) {
      return `${record['0']} / ${val}.2222`
    },
  },
]
</script>

<template>
  <WDemoCard title="Description Demo">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic Usage
        </WTitle>

        <WDescriptions
          :items="descs" size="small"
          label-placement="left"
          bordered
          :column="2"
          :label-style="{ width: '20%' }"
        />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
