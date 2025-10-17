<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { logAuthAPI } from '@/api/system/log'

defineOptions({
  name: 'LogAuth',
})

// locale unique key
const localeKey = 'log.auth'
// auth key
const authKey = 'log:auth'
const keyField = '_id'

const [register, {
  onDeleteManyConfirm,
  onDeleteConfirm,
  onApiList,
  onGetApiListParams,
}] = useCRUD<IModels.SystemLogAuth>({
  baseAPI: logAuthAPI,

  tableProps: {
    localeUniqueKey: localeKey,
    rowKey: row => row[keyField]!,
    striped: true,
    bordered: true,
    singleLine: false,

    headerLeftBuiltInActions: [
      {
        _builtInType: 'delete',
        onPresetClick() {
          onDeleteManyConfirm()
        },
      },
    ],

    auths: {
      list: `system:${authKey}:list`,
      deleteMany: `system:${authKey}:deleteMany`,
    },

    queryFormProps: {
      localeUniqueKey: localeKey,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 100,
      yGap: 10,
      // query form schemas
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'userName',
          },
          componentProp: {
            clearable: true,
            onKeyupEnter() {
              onApiList()
            },
          },
        },

        {
          type: 'Base:Input',
          formProp: {
            path: 'location',
          },
          componentProp: {
            clearable: true,
            onKeyupEnter() {
              onApiList()
            },
          },
        },

        {
          type: 'Base:Input',
          formProp: {
            path: 'ip',
          },
          componentProp: {
            clearable: true,
            onKeyupEnter() {
              onApiList()
            },
          },
        },

        {
          type: 'Base:DatePicker',
          formProp: {
            path: 'authenticatedAt',
          },
          componentProp: {
            type: 'daterange',
            clearable: true,
            format: 'yyyy-MM-dd',
            // TODO make this work in v-model
            // value-format use v-model:formatted-value
            valueFormat: 'yyyy-MM-dd',
            onUpdateFormattedValue(v: string) {
              const queryFormData = onGetApiListParams()
              queryFormData.value.query = Object.assign(queryFormData.value.query!, { authenticated: v })
            },
          },
        },

        {
          type: 'Extend:Query',
          componentProp: {
            foldable: true,
            defaultFold: true,
            countToFold: 2,
          },
        },
      ],
    },

    // table columns
    columns: [
      {
        key: 'selection',
        type: 'selection',
        fixed: 'left',
      },

      {
        key: 'index',
        extendType: 'index',
        fixed: 'left',
      },

      {
        key: 'userName',
        width: 120,
        sorter: {
          multiple: 2,
          compare: 'default',
        },
      },

      {
        key: 'success',
        width: 140,
        sorter: {
          multiple: 3,
          compare: 'default',
        },
        extendType: 'dict',
        dictType: 'sys_shared_success',
        filter: true,
        filterMultiple: false,
      },

      {
        key: 'type',
        width: 160,
        sorter: {
          multiple: 4,
          compare: 'default',
        },
        extendType: 'dict',
        dictType: 'sys_auth_type',
        filter: true,

        // use dict name as column title
        useDictNameAsTitle: true,
      },

      {
        key: 'ip',
        width: 160,
      },

      {
        key: 'location',
        width: 160,
        formatter: row => row.location || '-',
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'browser',
        width: 160,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'os',
        width: 160,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'msg',
        width: 200,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'authenticatedAt',
        width: 200,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
        defaultSortOrder: 'descend',
      },

      {
        key: 'action',
        width: 160,
        extendType: 'action',
        fixed: 'right',
        columnBuiltInActions: [
          {
            _builtInType: 'delete',
            async onPresetClick(rowData) {
              await onDeleteConfirm(rowData[keyField]!)
            },
          },
        ],
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.SystemLogAuth} -->
    <WCRUD @hook="register" />
  </div>
</template>
