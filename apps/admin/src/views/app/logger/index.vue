<script lang="tsx" setup>
import type { IModels } from '@/api/models'
import { appLoggerAPI } from '@/api/app/logger'
import AppLoggerLog from './log.vue'

defineOptions({
  name: 'AppLogger',
})

// locale unique key
const localeKey = 'appLogger'
const authKey = 'app:logger'
const keyField = 'filePath'

const { t } = useAppI18n()

const [
  register,
  { onApiList, onReadAndOpenUpdateForm, onGetFormData },
] = useCRUD<IModels.AppLogger>({
  baseAPI: appLoggerAPI,

  tableProps: {
    localeUniqueKey: localeKey,
    rowKey: row => row[keyField]!,
    striped: true,
    bordered: true,
    singleLine: false,

    auths: {
      list: `${authKey}:list`,
      read: `${authKey}:read`,
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
            path: 'fileName',
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
        key: 'fileName',
        width: 160,
        extendType: 'link',
        onClick: async (rowData) => {
          await onReadAndOpenUpdateForm(rowData[keyField]!)
        },
      },

      {
        key: 'logType',
        width: 120,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
        filter: true,
        filterMultiple: false,
        filterOptions: ['application', 'error'].map(i => ({
          value: i,
          label: i,
        })),
      },

      {
        key: 'filePath',
        width: 200,
      },

      {
        key: 'fileSize',
        width: 100,
        locale: false,
        title: computed(() => t('app.base.fileSizeKB')),
      },

      {
        key: 'fileMTime',
        width: 160,
      },
    ],
  },

  formProps: {
    dialogPreset: 'modal',
    labelWidth: 0,
    xGap: 0,

    dialogProps: {
      defaultButton: false,
      width: '80%',
      closable: true,
      autoFocus: false,
      fullscreen: false,
      displayDirective: 'if',
      title: computed((): string => {
        const formData = onGetFormData()
        return formData.value.fileName!
      }),
    },

    // create/update form schemas
    schemas: [
      {
        type: 'Base:Render',
        formProp: {
          path: 'fileContent',
        },
        componentProp: {
          render({ formData }) {
            return (
              <AppLoggerLog
                keyField={keyField}
                formData={formData}
              >
              </AppLoggerLog>
            )
          },
        },
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.AppLogger} -->
    <WCRUD @hook="register" />
  </div>
</template>
