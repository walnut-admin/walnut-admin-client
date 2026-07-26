<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { dictTypeAPI } from '@/api/system/dict'

defineOptions({
  name: 'Dict',
})

const { t } = useAppI18n()

// locale unique key
const localeKey = 'dictType'
const authKey = 'dict:type'
const keyField = '_id'

const [
  register,
  {
    onOpenCreateForm,
    onReadAndOpenUpdateForm,
    onDeleteConfirm,
    onGetFormData,
    onApiList,
  },
] = useCRUD<IModels.SystemDictType>({
  baseAPI: dictTypeAPI,

  safeForm: true,
  safeFormFeedback: true,
  safeFormKey: localeKey,
  safeFormUnwantedFields: ['status'],

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

    auths: {
      list: `system:${authKey}:list`,
      create: `system:${authKey}:create`,
      read: `system:${authKey}:read`,
      update: `system:${authKey}:update`,
    },

    queryFormProps: {
      localeUniqueKey: localeKey,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 100,
      // query form schemas
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'name',
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
            path: 'type',
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
            path: 'description',
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
        key: 'name',
        width: 120,
        titleHelpMessage: true,
        formatter: row => t(row.name!),
      },

      {
        key: 'type',
        width: 140,
        extendType: 'link',
        onClick: async (p) => {
          await useAppRouterPush({
            name: 'DictDetail',
            params: { id: p[keyField] },
            query: { name: p.name },
          })
        },
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'populated_dictDataCount',
        width: 100,
      },

      {
        key: 'description',
        width: 200,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        ...WTablePresetStatusColumn,
        sorter: {
          multiple: 2,
          compare: 'default',
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
        width: 160,
        extendType: 'action',
        fixed: 'right',
        columnBuiltInActions: [
          {
            _builtInType: 'read',
            async onPresetClick(rowData) {
              await onReadAndOpenUpdateForm(rowData[keyField]!)
            },
          },
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

  formProps: {
    localeUniqueKey: localeKey,
    localeWithTable: true,
    dialogPreset: 'modal',
    baseRules: true,
    labelWidth: 120,
    xGap: 0,
    // create/update form schemas
    schemas: [
      {
        type: 'Extra:LocaleSelect',
        formProp: {
          path: 'name',
        },
        componentProp: {
          prefix: 'dict.name.',
          presetKey: computed((): string => {
            const formData = onGetFormData()

            const type = formData.value.type

            if (type)
              return `dict.name.${type}`

            return 'dict.name.'
          }),
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'type',
        },
        componentProp: {
          clearable: true,
        },
      },

      {
        type: 'Business:Dict',
        formProp: {
          path: 'status',
        },
        componentProp: {
          dictType: 'sys_shared_status',
          renderType: 'radio',
          defaultValue: true,
          componentProps: {
            button: true,
            valueType: 'boolean',
          },
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'description',
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
    <!-- @vue-generic {IModels.SystemDictType} -->
    <WCRUD @hook="register" />
  </div>
</template>
