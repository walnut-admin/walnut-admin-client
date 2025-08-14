<script lang="ts" setup>
import { openExternalLink } from '@/utils/window/open'

defineOptions({
  name: 'UseTable',
})

interface DemoData {
  key?: number
  name?: string
  age?: number
  address?: string
  sex?: string
  link?: string
  tags?: string[]
}

const [register] = useTable<DemoData>({
  bordered: true,
  striped: true,
  rowKey: row => row.key!,
  headerLeftBuiltInActions: [
    {
      _builtInType: 'create',
      onPresetClick() {
        console.log('create')
      },
    },
    {
      _builtInType: 'delete',
      onPresetClick() {
        console.log('delete')
      },
    },
  ],
  columns: [
    {
      type: 'selection',
      key: 'selection',
      fixed: 'left',
      width: 80,
    },
    {
      extendType: 'index',
      key: 'index',
      fixed: 'left',
      width: 60,
    },
    {
      type: 'expand',
      renderExpand: row => `${row.name} - expanded`,
      key: 'expand',
      fixed: 'left',
      width: 80,
    },
    {
      title: 'Name',
      key: 'name',
      fixed: 'left',
      minWidth: 250,
    },
    {
      title: 'Age',
      key: 'age',
      minWidth: 250,
    },
    {
      title: 'Address',
      key: 'address',
      minWidth: 250,
    },
    {
      title: 'Icon',
      key: 'icon',
      minWidth: 250,
      extendType: 'icon',
      extendIconName: 'ant-design:home-outlined',
    },
    {
      title: 'Tags',
      key: 'tags',
      minWidth: 150,
      formatter(rowData) {
        return rowData.tags?.join(',')
      },
    },
    {
      title: 'Sex',
      key: 'sex',
      minWidth: 100,
      extendType: 'dict',
      dictType: 'gbt_sex',
      filter: true,
    },
    {
      title: 'Link',
      key: 'link',
      minWidth: 200,
      extendType: 'link',
      formatter(rowData) {
        return rowData.link?.slice(8)
      },
      onClick(data) {
        console.log('link', data)
        openExternalLink(data.link!)
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      extendType: 'action',
      columnBuiltInActions: [
        {
          _builtInType: 'detail',
          onPresetClick(data, _index) {
            console.log('defail', data)
          },
        },
        {
          _builtInType: 'delete',
          onPresetClick(data, _index) {
            console.log('delete', data)
          },
        },
      ],
      fixed: 'right',
    },
  ],
  data: [
    {
      key: 0,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      sex: '1',
      link: 'https://bing.com',
      tags: ['nice', 'developer'],
    },
    {
      key: 1,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      sex: '2',
      link: 'https://bing.com',
      tags: ['wow'],
    },
    {
      key: 2,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      sex: '9',
      link: 'https://bing.com',
      tags: ['cool', 'teacher'],
    },
  ],
  pagination: {
    pageSize: 10,
  },
})
</script>

<template>
  <WDemoCard title="useTable" description="Better typescript support.">
    <!-- @vue-generic {DemoData} -->
    <WTable @hook="register" />
  </WDemoCard>
</template>

<style lang="scss" scoped></style>
