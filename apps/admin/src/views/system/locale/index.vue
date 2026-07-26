<script lang="tsx" setup>
import type { OptionDataItem } from 'easy-fns-ts'
import type { IModels } from '@/api/models'
import type { WForm } from '@/components/UI/Form'
import { localeAPI } from '@/api/system/locale'

defineOptions({
  name: 'Locale',
})

const appStoreLocale = useAppStoreLocale()
const localeKey = useRouterQuery('localeKey')
const langId = useRouterQuery('langId')

// locale unique key
const key = 'locale'
const keyField = '_id'

const langList = ref<OptionDataItem[]>([])
onBeforeMount(async () => {
  langList.value = await appStoreLocale.onGetLangList()
})

const [
  register,
  {
    onOpenCreateForm,
    onReadAndOpenUpdateForm,
    onDeleteConfirm,
    onDeleteManyConfirm,
    onGetFormData,
    onApiList,
    onSetDefaultQueryFormData,
  },
] = useCRUD<IModels.SystemLocale>({
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
          type: 'Base:Select',
          formProp: {
            path: 'langId',
          },
          componentProp: {
            defaultValue: langId,
            // @ts-expect-error it worked
            options: langList,
            clearable: true,
            onUpdateValue(v: string) {
              v && onApiList()
            },
            onClear() {
              if (langId.value) {
                langId.value = undefined
              }
              else {
                onSetDefaultQueryFormData({ langId: null })
                onApiList()
              }
            },
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
            onUpdateValue() {
              onApiList()
            },
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
    labelWidth: 120,
    xGap: 0,
    // @ts-expect-error create/update form schemas
    schemas: computed<WForm.Schema.Item<IModels.SystemLocale>[]>(() => [
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

      ...langList.value.map<WForm.Schema.Item<IModels.SystemLocale>>(i => ({
        type: 'Base:Input',
        formProp: {
          path: i.value as keyof IModels.SystemLocale,
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

watch(langId, (v) => {
  onSetDefaultQueryFormData({ langId: v ?? null })
  onApiList()
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
    <!-- @vue-generic {IModels.SystemLocale} -->
    <WCRUD @hook="register" />
  </div>
</template>
