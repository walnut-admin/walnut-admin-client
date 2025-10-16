<script lang="ts" setup generic="T">
import { useTableContext } from '../../../hooks/useTableContext'
import TableHeaderRightColumns from './columns.vue'
import TableHeaderRightPolling from './polling.vue'

defineOptions({
  name: 'WTableHeaderRight',
})

const { onApiList, tablePropsCtx } = useTableContext<T>()
const { getProps: tableProps } = tablePropsCtx
</script>

<template>
  <div class="hstack items-center gap-x-2 children:cursor-pointer">
    <WIconButton
      v-if="!tableProps.polling"
      :icon-props="{ icon: 'ant-design:reload-outlined' }"
      :button-props="{ disabled: tableProps.loading, onClick: onApiList }"
      tooltip
      :tooltip-msg="$t('app.base.refresh')"
    />

    <!-- @vue-generic {T} -->
    <TableHeaderRightPolling v-if="tableProps.polling && tableProps.polling > 5000" />

    <!-- @vue-generic {T} -->
    <TableHeaderRightColumns />
  </div>
</template>
