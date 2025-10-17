<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { deletedAPI, recoverAPI } from '@/api/system/deleted'
import { logOperateAPI } from '@/api/system/log'
import { logOperateFormSchema } from '../log/operate/schema'

defineOptions({
  name: 'Deleted',
})

// locale unique key
const localeKey = 'deleted'
// auth key
const authKey = 'deleted'
const keyField = '_id'

const { t } = useAppI18n()

const logOperateFormData = ref<IModels.SystemLogOperate>({})

const [registerLogOperate, { onOpen }] = useForm<IModels.SystemLogOperate>({
  localeUniqueKey: 'log.operate',
  localeWithTable: true,
  dialogPreset: 'drawer',
  baseRules: true,
  labelWidth: 140,
  xGap: 0,

  descriptionProps: {
    bordered: true,
    column: 2,
    colon: true,
  },

  dialogProps: {
    defaultButton: false,
    width: '40%',
    closable: true,
    autoFocus: false,
    actionType: 'detail',
    onNo() {
      logOperateFormData.value = {}
    },
  },

  schemas: logOperateFormSchema,
})

const [
  register,
  {
    onReadAndOpenUpdateForm,
    onDeleteManyConfirm,
    onApiList,
    onGetApiListParams,
  },
] = useCRUD<IModels.SystemDeleted>({
  baseAPI: deletedAPI,

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
      read: `system:${authKey}:read`,
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
            path: 'content',
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
            path: 'modelName',
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
            path: 'collectionName',
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
            path: 'deletedAt',
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
              queryFormData.value.query = Object.assign(queryFormData.value.query!, { deletedAt: v })
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
        key: 'modelName',
        width: 160,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
      },

      {
        key: 'collectionName',
        width: 160,
        sorter: {
          multiple: 2,
          compare: 'default',
        },
      },

      {
        key: 'populated_user.userName',
        title: 'table.deleted.deletedBy',
        locale: false,
        width: 120,
        sorter: {
          multiple: 3,
          compare: 'default',
        },
      },

      {
        key: 'deletedAt',
        width: 200,
        sorter: {
          multiple: 6,
          compare: 'default',
        },
        defaultSortOrder: 'descend',
      },

      {
        key: 'action',
        width: 120,
        extendType: 'action',
        fixed: 'right',
        columnBuiltInActions: [
          {
            _builtInType: 'detail',
            async onPresetClick(rowData) {
              await onReadAndOpenUpdateForm(rowData[keyField]!)
            },
          },
        ],
        columnExtraActions: [
          {
            _builtInType: 'recover',
            confirm: true,
            buttonProps: {
              textProp: () => t('table.deleted.recover'),
              type: 'warning',
              size: 'small',
              auth: `system:${authKey}:recover`,
            },
            iconProps: {
              icon: 'mdi:backup-restore',
            },
            async onPresetClick(rowData) {
              await recoverAPI({ _id: rowData._id, deletedId: rowData.deletedId })
              useAppMsgSuccess()
              await onApiList()
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
    baseRules: true,
    labelWidth: 140,
    xGap: 0,

    descriptionProps: {
      bordered: true,
      column: 2,
      colon: true,
    },

    dialogProps: {
      defaultButton: false,
      width: '45%',
      closable: true,
      autoFocus: false,
    },

    schemas: [
      {
        type: 'Base:Input',
        formProp: {
          path: 'modelName',
        },
        descriptionProp: {
          span: 2,
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'collectionName',
        },
        descriptionProp: {
          span: 2,
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'content',
        },
        descriptionProp: {
          span: 2,
          type: 'json',
          typeProps: {
            height: '300px',
          },
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_user.userName',
          label: computed(() => t('table.deleted.deletedBy')),
          locale: false,
        },
        descriptionProp: {
          span: 2,
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'logOperateId',
          label: computed(() => t('app.base.relativeLog')),
          locale: false,
        },
        descriptionProp: {
          span: 2,
          type: 'link',
          formatter: () => t('app.base.detail'),
          typeProps: {
            type: 'primary',
            onLinkClick(value) {
              if (!value) {
                useAppMsgWarning(t('app.base.none'))
                return
              }
              onOpen(async (done) => {
                try {
                  const res = await logOperateAPI.read(`${value}`)
                  logOperateFormData.value = Object.assign(logOperateFormData.value, res)
                }
                finally {
                  done()
                }
              })
            },
          },
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'deletedAt',
        },
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.SystemDeleted} -->
    <WCRUD @hook="register" />

    <!-- @vue-generic {IModels.SystemLogOperate} -->
    <WForm :model="logOperateFormData" @hook="registerLogOperate" />
  </div>
</template>
