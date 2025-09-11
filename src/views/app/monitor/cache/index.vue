<script lang="tsx" setup>
import type { IModels } from '@/api/models'
import { monitorCacheAPI } from '@/api/app/monitor/cache'

// TODO 111
import WJSON from '@/components/Extra/JSON'

defineOptions({
  name: 'AppMonitorCache',
})

// locale unique key
const localeKey = 'appCache'
const authKey = 'cache'
const keyField = 'key'

const { t } = useAppI18n()

const [
  register,
  { onReadAndOpenUpdateForm, onDeleteConfirm, onApiList },
] = useCRUD<IModels.AppMonitorCache>({
  baseAPI: monitorCacheAPI,

  tableProps: {
    localeUniqueKey: localeKey,
    rowKey: row => row[keyField]!,
    striped: true,
    bordered: true,
    singleLine: false,

    polling: 10000,

    // clear default built in actions
    headerLeftBuiltInActions: [],

    headerLeftExtraActions: [
      {
        textProp: () => t('app.cache.clear'),
        type: 'error',
        icon: 'ant-design:delete-outlined',
        onClick: async () => {
          const { confirmed } = await useAppConfirm(t('app.cache.clear.confirm'))

          if (confirmed) {
            await monitorCacheAPI.clear()
            useAppMsgSuccess()
            await onApiList()
          }
        },
      },
    ],

    auths: {
      list: `app:monitor:${authKey}:list`,
      read: `app:monitor:${authKey}:read`,
      delete: `app:monitor:${authKey}:delete`,
    },

    queryFormProps: {
      localeUniqueKey: localeKey,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 80,
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'key',
          },
          componentProp: {
            clearable: true,
            onKeyupEnter() {
              onApiList()
            },
          },
        },

        {
          type: 'Extend:Query',
        },
      ],
    },

    // table columns
    columns: [
      {
        key: 'index',
        extendType: 'index',
        fixed: 'left',
      },

      {
        key: 'key',
        minWidth: 250,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
        ellipsis: {
          tooltip: {
            contentStyle: {
              maxWidth: '800px',
              maxHeight: '70vh',
            },
          },
        },
      },

      {
        key: 'type',
        width: 250,
        extendType: 'dict',
        dictType: 'app_cache_type',
        filter: true,
        useDictNameAsTitle: true,
      },

      {
        key: 'valueBytes',
        width: 140,
        sorter: {
          multiple: 2,
          compare: 'default',
        },
      },

      {
        key: 'expire',
        width: 100,
        sorter: {
          multiple: 3,
          compare: 'default',
        },
      },

      {
        key: 'startTime',
        width: 200,
        sorter: {
          multiple: 4,
          compare: 'default',
        },
      },

      {
        key: 'expireTime',
        width: 200,
        sorter: {
          multiple: 5,
          compare: 'default',
        },
      },

      {
        key: 'action',
        width: 160,
        extendType: 'action',
        fixed: 'right',
        columnBuiltInActions: [
          {
            _builtInType: 'detail',
            async onPresetClick(rowData) {
              await onReadAndOpenUpdateForm(rowData[keyField]!)
            },
          },
          {
            _builtInType: 'delete',
            _disabled(rowData) {
              return ['built-in', 'auth-permissions', 'verify-code', 'sys-device-id-list'].includes(rowData.type!)
            },
            async onPresetClick(rowData) {
              await onDeleteConfirm(rowData[keyField]!)
            },
          },
        ],
      },
    ],
  },

  formProps: {
    localeUniqueKey: localeKey,
    localeWithTable: true,
    dialogPreset: 'drawer',
    labelWidth: 0,
    xGap: 0,

    dialogProps: {
      defaultButton: false,
      width: '40%',
      closable: true,
      autoFocus: false,
      actionType: 'detail',
    },

    schemas: [
      {
        type: 'Base:Render',
        formProp: {
          path: 'data',
          showLabel: false,
        },
        componentProp: {
          render({ formData }) {
            return <WJSON height="100%" value={formData.value}></WJSON>
          },
        },
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.AppMonitorCache} -->
    <WCRUD @hook="register" />
  </div>
</template>
