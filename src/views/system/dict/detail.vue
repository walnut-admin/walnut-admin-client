<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { dictDataAPI } from '@/api/system/dict'

defineOptions({
  name: 'DictDetail',
})

const { t } = useAppI18n()

const title = useRouterQuery('name')
const typeId = useRouterParam('id')

// locale unique key
const localeKey = 'dictData'
const authKey = 'dict:data'
const keyField = '_id'

async function onBack() {
  await useAppRouterPush({ name: 'Dict', replace: true })
}

const getLocalePrefix = computed(() => `dict.${title.value?.split('.').slice(-1)}.`)

const [
  register,
  {
    onOpenCreateForm,
    onReadAndOpenUpdateForm,
    onDeleteConfirm,
    onGetFormData,
  },
] = useCRUD<IModels.SystemDictData>({
  baseAPI: dictDataAPI,

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
      delete: `system:${authKey}:delete`,
      deleteMany: `system:${authKey}:deleteMany`,
    },

    queryFormProps: {
      localeUniqueKey: localeKey,
      localeWithTable: true,
      span: 8,
      showFeedback: false,
      labelWidth: 100,
      // query form schemas
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'typeId',
          },
          componentProp: {
            defaultValue: typeId,
          },
          visibleProp: {
            vIf: false,
          },
        },

        {
          type: 'Base:Input',
          formProp: {
            path: 'value',
          },
          componentProp: {
            clearable: true,
          },
        },

        {
          type: 'Base:Input',
          formProp: {
            path: 'description',
          },
          componentProp: {
            clearable: true,
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
        key: 'label',
        width: 240,
        formatter: row => t(row.label!),
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'value',
        width: 120,
      },

      {
        ...WTablePresetOrderColumn,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
      },

      {
        key: 'tagType',
        width: 140,
        extendType: 'dict',
        dictType: 'sys_type',
        filter: true,
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
        type: 'Base:Input',
        formProp: {
          path: 'typeId',
        },
        componentProp: {
          clearable: true,
          defaultValue: typeId,
        },
        visibleProp: {
          vShow: false,
        },
      },

      {
        type: 'Extra:LocaleSelect',
        formProp: {
          path: 'label',
        },
        componentProp: {
          prefix: getLocalePrefix,
          presetKey: computed((): string => {
            const formData = onGetFormData()

            const val = formData.value.value

            const key = title.value?.split('.')[2]

            if (val)
              return `dict.${key}.${val}`

            return `dict.${key}.`
          }),
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'value',
        },
        componentProp: {
          clearable: true,
        },
      },

      {
        // TODO
        type: 'Base:Select',
        formProp: {
          path: 'tagType',
        },
        componentProp: {
          clearable: true,
          options: [
            {
              value: 'primary',
              label: 'primary',
            },
            {
              value: 'info',
              label: 'info',
            },
            {
              value: 'success',
              label: 'success',
            },
            {
              value: 'warning',
              label: 'warning',
            },
            {
              value: 'error',
              label: 'error',
            },
          ],
        },
      },

      {
        type: 'Base:InputNumber',
        formProp: {
          path: 'order',
        },
        componentProp: {
          clearable: true,
          defaultValue: 0,
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
    <n-card>
      <n-page-header v-if="title" :title="$t(title)" @back="onBack" />
    </n-card>
    <!-- @vue-generic {IModels.SystemDictData} -->
    <WCRUD @hook="register" />
  </div>
</template>
