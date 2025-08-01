<script lang="ts" setup generic="T">
import type { ICompUITableHooksAPIListParams } from './hooks/useTableAPIListParams'
import type { WTable } from './types'

import { omit } from 'lodash-es'
import TableHeader from './components/header/index.vue'

import QueryForm from './components/queryForm.vue'
import { useTableAPI } from './hooks/useTableAPI'
import { useTableAPIListParams } from './hooks/useTableAPIListParams'
import { useTableColumns } from './hooks/useTableColumns'
import { setTableContext } from './hooks/useTableContext'
import { useTableMethods } from './hooks/useTableMethods'
import { extendedTablePropKeys } from './utils'

defineOptions({
  name: 'WCompUITable',
})

const props = withDefaults(defineProps<WTable.Props<T>>(), {
  // original default
  allowCheckingNotLoaded: false,
  bordered: true,
  bottomBordered: true,
  cascade: true,
  childrenKey: 'children',
  columns: () => [],
  data: () => [],
  defaultCheckedRowKeys: () => [],
  defaultExpandedRowKeys: () => [],
  defaultExpandAll: false,
  filterIconPopoverProps: () => ({
    trigger: 'click',
    placement: 'bottom',
  }),
  flexHeight: false,
  headerHeight: 28,
  indent: 16,
  loading: false,
  minRowHeight: 28,
  paginateSinglePage: true,
  pagination: false,
  paginationBehaviorOnFilter: 'current',
  remote: false,
  singleColumn: false,
  singleLine: true,
  size: 'medium',
  stickyExpandedRows: false,
  striped: false,
  summayPlacement: 'bottom',
  tableLayout: 'auto',
  virtualScroll: false,
  virtualScrollHeader: false,
  virtualScrollX: false,

  // extend
  headerLeftBuiltInActions: () => ([{ _builtInType: 'create' }, { _builtInType: 'delete' }]),
  headerLeftExtraActions: () => ([]),
})

const emits = defineEmits<WTable.Emits<T>>()

const tableRef = useTemplateRef<WTable.Inst.NDataTableInst>('tableRef')

const tablePropsCtx = useProps<WTable.Props<T>>(props)

const { setProps, getProps } = tablePropsCtx

const getTableProps = computed(() => omit(getProps.value, extendedTablePropKeys))

const listParams: ICompUITableHooksAPIListParams<T> = useTableAPIListParams()

const tableColumns = useTableColumns(tablePropsCtx, listParams.apiListParams)

const {
  onApiList,
  onApiQuery,
  onApiReset,
  onApiDelete,
  onApiDeleteMany,
  checkedRowKeys,
} = useTableAPI<T>(tableRef, tablePropsCtx, tableColumns, listParams)

const tableMethods = useTableMethods(tableRef)

setTableContext<T>({
  tableRef,
  tableColumns,
  tableEvent: emits,
  tablePropsCtx,

  apiListParams: listParams.apiListParams,
  onApiList,
  onApiQuery,
  onApiReset,

  checkedRowKeys,
})

// expose
defineExpose({
  ...tableMethods,
})

// hook
emits('hook', {
  ...tableMethods,
  setProps,
  onApiList,
  onApiDelete,
  onApiDeleteMany,
  onGetApiListParams: () => listParams.apiListParams,
})

// min/max height
const appSetting = useAppStoreSetting()
const formCardRef = useTemplateRef<HTMLDivElement>('formCardRef')
const { height } = useElementSize(formCardRef)
const getTableHeight = computed(() => `calc(${appSetting.getCalcContentHeightWithPadding} - ${height.value}px - 185px)`)
</script>

<template>
  <n-card v-if="getProps.queryFormProps" ref="formCardRef" class="mb-2">
    <!-- @vue-generic {T} -->
    <QueryForm />
  </n-card>

  <n-card>
    <!-- @vue-generic {T} -->
    <TableHeader />

    <!-- @vue-expect-error -->
    <n-data-table
      ref="tableRef"
      v-bind="getTableProps"
      :min-height="getTableHeight"
      :max-height="getTableHeight"
      :columns="tableColumns.filter(i => i._internalShow)"
    />
  </n-card>
</template>

<style lang="scss" scoped>

</style>
