<script lang="tsx" setup>
import type { WForm } from '@/components/UI/Form'
import { localeAPI } from '@/api/system/locale'
import WBussinessLangSelect from '@/components/Business/LangSelect'
import { useLangList } from './useLangList'

defineOptions({
  name: 'Locale',
})

const { langList } = useLangList()
const localeKey = useRouterQuery('localeKey')
const langId = useRouterQuery('langId')

// locale unique key
const key = 'locale'
const keyField = '_id'

const [
  register,
  {
    onOpenCreateForm,
    onReadAndOpenUpdateForm,
    onDeleteConfirm,
    onDeleteManyConfirm,
    onGetFormData,
    onApiList,
  },
] = useCRUD<AppSystemLocale>({
  baseAPI: localeAPI,

  safeForm: true,
  safeFormFeedback: true,
  safeFormKey: key,
  safeFormUnwantedFields: ['status'],

  tableProps: {
    localeUniqueKey: key,
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
      {
        _builtInType: 'delete',
        onPresetClick() {
          onDeleteManyConfirm()
        },
      },
    ],

    auths: {
      list: `system:${key}:list`,
      create: `system:${key}:create`,
      read: `system:${key}:read`,
      update: `system:${key}:update`,
      delete: `system:${key}:delete`,
      deleteMany: `system:${key}:deleteMany`,
    },

    queryFormProps: {
      localeUniqueKey: key,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 90,
      // query form schemas
      schemas: [
        {
          type: 'Base:Render',
          formProp: {
            path: 'langId',
          },
          componentProp: {
            defaultValue: langId,
            render: () => (<WBussinessLangSelect v-model={[langId.value, 'value']}></WBussinessLangSelect>),
          },
        },

        {
          type: 'Base:Select',
          formProp: {
            path: 'key',
          },
          componentProp: {
            clearable: true,
            tag: true,
            filterable: true,
            options: ['app.', 'sys.', 'form.', 'table.', 'dict.'].map(
              i => ({
                value: i,
                label: i,
              }),
            ),
          },
        },

        {
          type: 'Base:Input',
          formProp: {
            path: 'value',
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
        key: 'key',
        width: 300,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
        fixed: 'left',
      },

      {
        key: 'process',
        width: 100,
        formatter: row => `${(row.process! * 100).toFixed(2)}%`,
      },

      {
        ...WTablePresetCreatedAtColumn,
        sorter: {
          multiple: 2,
          compare: 'default',
        },
      },

      {
        ...WTablePresetUpdatedAtColumn,
        defaultSortOrder: 'descend',
        sorter: {
          multiple: 3,
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
              const formData = onGetFormData()
              formData.value = Object.assign(formData.value, { oldKey: rowData.key })
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
    localeUniqueKey: key,
    localeWithTable: true,
    dialogPreset: 'modal',
    baseRules: true,
    labelWidth: 100,
    xGap: 0,
    // @ts-expect-error create/update form schemas
    schemas: computed<WForm.Schema.Item<AppSystemLocale>[]>(() => [
      {
        type: 'Base:Input',
        formProp: {
          path: 'key',
        },
        componentProp: {
          clearable: true,
          defaultValue: localeKey.value,
        },
      },

      ...langList.value.map<WForm.Schema.Item<AppSystemLocale>>(i => ({
        type: 'Base:Input',
        formProp: {
          path: i.value as keyof AppSystemLocale,
          label: i.label,
          locale: false,
          rule: false,
        },
        componentProp: {
          clearable: true,
          type: 'textarea',
        },
      })),
    ]),
  },
})

onMounted(() => {
  const id = setTimeout(() => {
    if (localeKey.value) {
      onOpenCreateForm(false)
    }
    clearTimeout(id)
  }, 1000)
})

onActivated(() => {
  if (localeKey.value) {
    onOpenCreateForm(false)
  }
})
</script>

<template>
  <div>
    <!-- @vue-generic {AppSystemLocale} -->
    <WCRUD @hook="register" />
  </div>
</template>
