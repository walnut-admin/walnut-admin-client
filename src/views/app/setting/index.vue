<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { appSettingAPI, refreshAppSettingsCacheAPI } from '@/api/app/setting'

defineOptions({
  name: 'AppSetting',
})

// locale unique key
const localeKey = 'appSetting'
const authKey = 'app:setting'
const keyField = '_id'

const { t } = useAppI18n()

const [
  register,
  { onOpenCreateForm, onApiList, onReadAndOpenUpdateForm, onGetActionType },
] = useCRUD<IModels.AppSettings>({
  baseAPI: appSettingAPI,

  tableProps: {
    localeUniqueKey: localeKey,
    rowKey: row => row[keyField]!,
    striped: true,
    bordered: true,
    singleLine: false,

    headerLeftBuiltInActions: [
      {
        _builtInType: 'create',
        onPresetClick() {
          onOpenCreateForm()
        },
      },
    ],

    headerLeftExtraActions: [
      {
        type: 'warning',
        textProp: computed(() => t('app.base.cache.refresh')),
        icon: 'mdi:refresh',
        onClick: async () => {
          await refreshAppSettingsCacheAPI()
          useAppMsgSuccess()
        },
        debounce: 300,
        auth: `${authKey}:cache:refresh`,
      },
    ],

    auths: {
      list: `${authKey}:list`,
      create: `${authKey}:create`,
      read: `${authKey}:read`,
      update: `${authKey}:update`,
    },

    queryFormProps: {
      localeUniqueKey: localeKey,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 80,
      // query form schemas
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'settingName',
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
            path: 'settingKey',
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
            path: 'settingValue',
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
        key: 'settingName',
        width: 240,
      },

      {
        key: 'settingKey',
        width: 240,
      },

      {
        key: 'settingValue',
        width: 120,
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
        key: 'settingType',
        width: 120,
        extendType: 'dict',
        dictType: 'app_setting_type',
        filter: true,
        useDictNameAsTitle: true,
      },

      {
        key: 'remark',
        width: 200,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        ...WTablePresetCreatedAtColumn,
        sorter: {
          multiple: 3,
          compare: 'default',
        },
      },

      {
        ...WTablePresetUpdatedAtColumn,
        sorter: {
          multiple: 4,
          compare: 'default',
        },
      },

      {
        key: 'action',
        width: 80,
        extendType: 'action',
        fixed: 'right',
        columnBuiltInActions: [
          {
            _builtInType: 'read',
            async onPresetClick(rowData) {
              await onReadAndOpenUpdateForm(rowData[keyField]!)
            },
          },
        ],

      },
    ],
  },

  formProps: {
    localeUniqueKey: localeKey,
    localeWithTable: true,
    dialogPreset: 'modal',
    baseRules: true,
    labelWidth: 100,
    xGap: 0,
    // create/update form schemas
    schemas: [
      {
        type: 'Base:Input',
        formProp: {
          path: 'settingName',
        },
        componentProp: {
          clearable: true,
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'settingKey',
        },
        componentProp: {
          clearable: true,
          disabled: computed((): boolean => onGetActionType().value === 'update'),
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'settingValue',
        },
        componentProp: {
          clearable: true,
          type: 'textarea',
          autosize: {
            minRows: 3,
            maxRows: 8,
          },
        },
      },

      {
        type: 'Business:Dict',
        formProp: {
          path: 'settingType',

          // use dict name as label
          label: true,
        },
        componentProp: {
          dictType: 'app_setting_type',
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'remark',
          rule: false,
        },
        componentProp: {
          clearable: true,
          type: 'textarea',
        },
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.AppSettings} -->
    <WCRUD @hook="register" />
  </div>
</template>
