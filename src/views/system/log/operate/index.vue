<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { getLogOperateSnapshotAPI, logOperateAPI } from '@/api/system/log'
import { logOperateFormSchema } from './schema'

defineOptions({
  name: 'LogOperate',
})

const { t } = useAppI18n()

const auths = {
  getSnapshot: 'system:log:operate:getSnapshot',
}

// locale unique key
const localeKey = 'log.operate'
// auth key
const authKey = 'log:operate'
const keyField = '_id'

const showMerge = ref(false)
const modalLoading = ref(false)
const mergeData = ref<{
  snapshotBefore?: string
  snapshotAfter?: string
}>({})

const [
  register,
  {
    onReadAndOpenUpdateForm,
    onApiList,
    onGetApiListParams,
    onGetFormData,
  },
] = useCRUD<IModels.SystemLogOperate>({
  baseAPI: logOperateAPI,

  tableProps: {
    localeUniqueKey: localeKey,
    rowKey: row => row[keyField]!,
    striped: true,
    bordered: true,
    singleLine: false,

    auths: {
      list: `system:${authKey}:list`,
      read: `system:${authKey}:read`,
    },

    queryFormProps: {
      localeUniqueKey: localeKey,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 80,
      yGap: 10,
      // query form schemas
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'title',
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
            path: 'operatedAt',
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
              queryFormData.value.query = Object.assign(queryFormData.value.query!, { operatedAt: v })
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
        key: 'index',
        extendType: 'index',
        fixed: 'left',
      },

      {
        key: 'title',
        width: 100,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
      },

      {
        key: 'actionType',
        width: 140,
        extendType: 'dict',
        dictType: 'sys_operate_type',
        sorter: {
          multiple: 2,
          compare: 'default',
        },
        filter: true,
      },

      {
        key: 'method',
        width: 120,
        sorter: {
          multiple: 3,
          compare: 'default',
        },
        filter: true,
        filterOptions: ['GET', 'POST', 'PUT', 'DELETE'].map(i => ({
          value: i,
          label: i,
        })),
      },

      {
        key: 'userName',
        width: 120,
        sorter: {
          multiple: 4,
          compare: 'default',
        },
      },

      {
        key: 'ip',
        width: 120,
      },

      {
        key: 'success',
        width: 120,
        sorter: {
          multiple: 5,
          compare: 'default',
        },
        extendType: 'dict',
        dictType: 'sys_shared_success',
        filter: true,
        filterMultiple: false,
      },

      {
        key: 'operatedAt',
        width: 200,
        sorter: {
          multiple: 6,
          compare: 'default',
        },
        defaultSortOrder: 'descend',
      },

      {
        key: 'action',
        width: 80,
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
      width: '40%',
      closable: true,
      autoFocus: false,

      footerButtons: [
        {
          textProp: computed(() => t('sys.log.operate.getSnapshot')),
          auth: auths.getSnapshot,
          debounce: 300,
          loading: computed(() => modalLoading.value),
          disabled: computed((): boolean => {
            const formData = onGetFormData()
            return formData.value.actionType !== 'UPDATE'
          }),
          async onClick() {
            modalLoading.value = true
            try {
              const formData = onGetFormData()
              const snapshot = await getLogOperateSnapshotAPI(formData.value._id!)
              mergeData.value = snapshot
              showMerge.value = true
            }
            finally {
              modalLoading.value = false
            }
          },
        },
      ],
    },

    schemas: logOperateFormSchema,
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.SystemLogOperate} -->
    <WCRUD @hook="register" />

    <WAppAuthorize :value="auths.getSnapshot">
      <WModal
        v-model:show="showMerge"
        width="80%"
        :fullscreen="false"
        :default-button="false"
        :title="$t('app.base.compare')"
        display-directive="show"
        :loading="modalLoading"
      >
        <WCodeMirrorMerge :after="mergeData.snapshotAfter" :before="mergeData.snapshotBefore" />
      </WModal>
    </WAppAuthorize>
  </div>
</template>
