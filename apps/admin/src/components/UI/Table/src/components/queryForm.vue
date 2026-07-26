<script lang="ts" setup generic="T">
import { useTableContext } from '../hooks/useTableContext'

const { tablePropsCtx, apiListParams, onApiQuery, onApiReset }
  = useTableContext<T>()

const { getProps: tableProps } = tablePropsCtx

const getFormProps = computed(() => ({
  ...tableProps.value?.queryFormProps,
  disabled: tableProps.value.loading,
}))

const [register] = useForm<T>(getFormProps)
</script>

<template>
  <!-- @vue-generic {T} -->
  <WForm
    :model="apiListParams.query"
    @hook="register"
    @query="onApiQuery"
    @reset="onApiReset"
  />
</template>
