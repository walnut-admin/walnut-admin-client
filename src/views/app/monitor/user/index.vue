<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { forceQuitAPI, monitorUserAPI } from '@/api/app/monitor/user'

defineOptions({
  name: 'AppMonitorUser',
})

// locale unique key
const localeKey = 'app.monitor.user'
const authKey = 'user'
const keyField = '_id'

const { t } = useAppI18n()

const [register, { onReadAndOpenUpdateForm, onApiList }] = useCRUD<IModels.AppMonitorUser>({
  baseAPI: monitorUserAPI,

  tableProps: {
    localeUniqueKey: localeKey,
    rowKey: row => row[keyField]!,
    striped: true,
    bordered: true,
    singleLine: false,

    polling: 10000,

    auths: {
      list: `app:monitor:${authKey}:list`,
      read: `app:monitor:${authKey}:read`,
    },

    // clear default built in actions
    headerLeftBuiltInActions: [],

    queryFormProps: {
      localeUniqueKey: localeKey,
      localeWithTable: true,
      span: 6,
      labelWidth: 80,
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'visitorId',
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
          type: 'Base:Input',
          formProp: {
            path: 'country',
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
            path: 'browser',
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
            path: 'os',
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
        key: 'visitorId',
        minWidth: 160,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'populated_device.ipHistory',
        width: 160,
        title: 'ip',
      },
      {
        key: 'populated_device.locationInfo.country',
        width: 100,
        title: 'country',
      },

      {
        key: 'populated_device.deviceInfo.browser',
        width: 160,
        title: 'browser',
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'populated_device.deviceInfo.os',
        title: 'os',
        width: 160,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'lastActiveAt',
        title: 'lastActiveAt',
        width: 200,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
        defaultSortOrder: 'descend',
      },

      {
        key: 'populated_user.userName',
        title: 'userName',
        width: 100,
      },

      {
        key: 'auth',
        width: 120,
        extendType: 'tag',
        tagProps: row => ({
          type: row.auth === true ? 'success' : 'warning',
          size: 'small',
        }),
        formatter: row =>
          row.auth === true
            ? t('table.app.monitor.user.auth.true')
            : t('table.app.monitor.user.auth.false'),
        filter: true,
        filterMultiple: false,
        filterOptions: [
          {
            value: 'true',
            label: computed(() => t('table.app.monitor.user.auth.true')),
          },
          {
            value: 'false',
            label: computed(() => t('table.app.monitor.user.auth.false')),
          },
        ],
      },

      {
        key: 'focus',
        width: 160,
        extendType: 'tag',
        tagProps: row => ({
          type: row.focus === true ? 'success' : 'info',
          size: 'small',
        }),
        formatter: row =>
          row.focus === true
            ? t('table.app.monitor.user.focus.true')
            : t('table.app.monitor.user.focus.false'),
        filter: true,
        filterMultiple: false,
        filterOptions: [
          {
            value: 'true',
            label: computed(() => t('table.app.monitor.user.focus.true')),
          },
          {
            value: 'false',
            label: computed(() => t('table.app.monitor.user.focus.false')),
          },
        ],
      },

      {
        key: 'left',
        width: 120,
        extendType: 'tag',
        tagProps: row => ({
          type: row.left === true ? 'error' : 'success',
          size: 'small',
        }),
        formatter: row =>
          row.left === true
            ? t('table.app.monitor.user.left.true')
            : t('table.app.monitor.user.left.false'),
        filter: true,
        filterMultiple: false,
        filterOptions: [
          {
            value: 'true',
            label: computed(() => t('table.app.monitor.user.left.true')),
          },
          {
            value: 'false',
            label: computed(() => t('table.app.monitor.user.left.false')),
          },
        ],
      },

      {
        key: 'action',
        width: 200,
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
            _builtInType: 'force-quit',
            confirm: true,
            _disabled: row => !row.auth,
            iconProps: {
              icon: 'ant-design:logout-outlined',
            },
            buttonProps: {
              auth: `app:monitor:${authKey}:forceQuit`,
              type: 'error',
              textProp: () => t('app.monitor.user.forceLogout'),
            },
            async onPresetClick(rowData) {
              await forceQuitAPI(rowData[keyField]!)
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
    labelWidth: 140,
    xGap: 0,

    descriptionProps: {
      bordered: true,
      column: 3,
      labelPlacement: 'left',
      labelStyle: {
        width: '100px',
      },
      contentStyle: {
        minWidth: '300px',
      },
    },

    dialogProps: {
      defaultButton: false,
      width: '40%',
      closable: true,
      autoFocus: false,
    },

    schemas: [
      {
        type: 'Base:Input',
        formProp: {
          path: 'visitorId',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'userId',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_user.userName',
          label: 'userName',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'currentRouter',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.ipHistory[0]',
          label: 'ip',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.deviceName',
          label: 'deviceName',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.deviceInfo.type',
          label: 'deviceType',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.deviceInfo.os',
          label: 'os',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.deviceInfo.browser',
          label: 'browser',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.deviceInfo.isp',
          label: 'isp',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.deviceInfo.platform',
          label: 'platform',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.deviceInfo.netType',
          label: 'netType',
        },
        descriptionProp: {
          span: 3,
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.locationInfo.country',
          label: 'country',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'populated_device.locationInfo.city',
          label: 'city',
        },
        descriptionProp: {
          span: 3,
        },
      },

      {
        type: 'Base:Input',
        formProp: {
          path: 'firstVisitAt',
        },
        descriptionProp: {
          span: 3,
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'lastActiveAt',
        },
        descriptionProp: {
          span: 3,
        },
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.AppMonitorUser} -->
    <WCRUD @hook="register" />
  </div>
</template>
