<script lang="ts" setup>
import type { StringOrNumber } from 'easy-fns-ts'
import { roleAPI } from '@/api/system/role'
import { WithValueProps } from '@/components/HOC/WithValue'
import ApiSelect from '../ApiSelect'

defineOptions({
  name: 'WRoleSelect',
})

defineProps(WithValueProps)

const emit = defineEmits(['update:value'])

function onUpdateValue(val: StringOrNumber) {
  emit('update:value', val)
}

const listFn = roleAPI.list.bind(roleAPI)
const readFn = roleAPI.read.bind(roleAPI)
</script>

<template>
  <ApiSelect
    :value="value"
    :list-fn="listFn"
    :read-fn="readFn"
    value-field="_id"
    label-field="roleName"
    :multiple="multiple"
    :value-separator="valueSeparator"
    @update:value="onUpdateValue"
  />
</template>
