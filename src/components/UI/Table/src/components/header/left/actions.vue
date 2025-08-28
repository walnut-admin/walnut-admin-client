<script lang="ts" setup generic="T">
import type { WTable } from '../../../types'
import { sortBy } from 'lodash-es'

import { useTableContext } from '../../../hooks/useTableContext'

defineOptions({
  name: 'WTableHeaderLeftActions',
})

const { t } = useI18n()

const userStorePermission = useAppStoreUserPermission()

const { tablePropsCtx, checkedRowKeys } = useTableContext<T>()

const { getProps: tableProps } = tablePropsCtx

const getDeleteDisabled = computed(() => checkedRowKeys.value.length === 0)

function isShow(t: WTable.HeaderLeftBulitInActionType) {
  return tableProps.value.headerLeftBuiltInActions?.map(i => i._builtInType).includes(t)
}

const options = computed<{
  type: WTable.HeaderLeftBulitInActionType
  text: string
  icon: string
  disabled?: boolean
  auth?: string
}[]>(() =>
  sortBy(
    [
      {
        type: 'create' as WTable.HeaderLeftBulitInActionType,
        icon: 'ant-design:plus-outlined',
        text: t('app.base.create'),
        auth: tableProps.value.auths?.create ?? 'force-auth',
      },
      {
        type: 'update' as WTable.HeaderLeftBulitInActionType,
        icon: 'ant-design:edit-outlined',
        text: t('app.base.read'),
        auth: tableProps.value.auths?.update ?? 'force-auth',
      },
      {
        type: 'delete' as WTable.HeaderLeftBulitInActionType,
        icon: 'ant-design:delete-outlined',
        text: t('app.base.delete'),
        disabled: getDeleteDisabled.value,
        auth: tableProps.value.auths?.deleteMany ?? 'force-auth',
      },
      {
        type: 'import' as WTable.HeaderLeftBulitInActionType,
        icon: 'ant-design:plus-outlined',
        text: t('app.base.import'),
        auth: tableProps.value.auths?.import ?? 'force-auth',
      },
      {
        type: 'export' as WTable.HeaderLeftBulitInActionType,
        icon: 'ant-design:plus-outlined',
        text: t('app.base.export'),
        auth: tableProps.value.auths?.export ?? 'force-auth',
      },
    ],
    i => tableProps.value.headerLeftBuiltInActions?.map(i => i._builtInType).indexOf(i.type),
  ).filter(i => isShow(i.type)),
)

function onButtonClick(key: WTable.HeaderLeftBulitInActionType) {
  const target = tableProps.value.headerLeftBuiltInActions?.find(i => i._builtInType === key)
  target && target.onPresetClick!()
}
</script>

<template>
  <div class="hstack items-center space-x-2">
    <!-- preset buttons -->
    <WButton
      v-for="item in options"
      :key="item.type"
      :icon="item.icon"
      :text-prop="item.text"
      :disabled="
        item.type === 'delete' ? getDeleteDisabled : tableProps.loading
      "
      :confirm="item.type === 'delete'"
      :auth="item.auth"
      @click="onButtonClick(item.type)"
    />

    <!-- extra custom buttons -->
    <WButton v-for="(item, index) in tableProps.headerLeftExtraActions" :key="index" v-bind="item" />

    <n-text
      v-if="
        isShow('delete')
          && userStorePermission.hasPermission(tableProps.auths?.deleteMany ?? 'force-auth')
      "
      type="warning"
    >
      {{
        t('table.header.action.checkedText', { checked: checkedRowKeys.length })
      }}
    </n-text>
  </div>
</template>
