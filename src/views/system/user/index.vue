<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { clearPasswordAPI, userAPI } from '@/api/system/user'

defineOptions({
  name: 'User',
})

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()

// locale unique key
const key = 'user'
const keyField = '_id'

const { stateRef: updatePasswordFormData, resetState: resetPasswordFormData } = useState({ userId: '', userName: '', newPassword: '' })

const [registerUpdatePassword, { onOpen }] = useForm<typeof updatePasswordFormData.value>({
  dialogPreset: 'modal',
  baseRules: true,
  labelWidth: 120,
  xGap: 0,

  dialogProps: {
    title: computed(() => t('dict.sys_operate_type.update_password')),
    width: '40%',
    onYes,
    onNo: (done) => {
      resetPasswordFormData()
      done()
    },
  },

  schemas: [
    {
      type: 'Extra:Password',
      formProp: {
        path: 'newPassword',
        label: computed(() => t('app.base.pass.new')),
        first: true,
        rule: [
          {
            key: 'newPassword',
            type: 'string',
            min: 8,
            max: 80,
            required: true,
            message: 'Password is not valid',
          },
        ],
      },
      componentProp: {
        progress: true,
        capslock: true,
      },
    },
  ],
})

const [
  register,
  {
    onOpenCreateForm,
    onReadAndOpenUpdateForm,
    onDeleteConfirm,
    onDeleteManyConfirm,
    onApiList,
  },
] = useCRUD<IModels.SystemUser>({
  baseAPI: userAPI,

  strictFormData: true,

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
    },

    queryFormProps: {
      localeUniqueKey: key,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 120,
      schemas: [
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
            path: 'nickName',
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
        key: 'userName',
        width: 100,
      },

      {
        key: 'nickName',
        width: 100,
        formatter(rowData, _rowIndex) {
          return rowData.nickName ?? '-'
        },
      },

      {
        key: 'populated_rolesCount',
        width: 80,
      },

      {
        ...WTablePresetStatusColumn,
        sorter: {
          multiple: 3,
          compare: 'default',
        },
      },

      {
        ...WTablePresetCreatedAtColumn,
        sorter: {
          multiple: 1,
          compare: 'default',
        },
      },

      {
        ...WTablePresetUpdatedAtColumn,
        defaultSortOrder: 'descend',
        sorter: {
          multiple: 2,
          compare: 'default',
        },
      },

      {
        key: 'action',
        width: 100,
        extendType: 'action',
        fixed: 'right',
        columnBuiltInActions: [
          {
            _builtInType: 'read',
            _show: row => !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.ROOT) && !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.DEVELOPER),
            async onPresetClick(rowData) {
              await onReadAndOpenUpdateForm(rowData[keyField]!)
            },
          },
          {
            _builtInType: 'delete',
            _dropdown: true,
            _show: row => !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.ROOT) && !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.DEVELOPER),
            async onPresetClick(rowData) {
              await onDeleteConfirm(rowData[keyField]!)
            },
          },
        ],
        columnExtraActions: [
          {
            _builtInType: 'updatePass',
            _dropdown: true,
            _show: row => !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.ROOT) && !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.DEVELOPER),
            async onPresetClick(rowData) {
              updatePasswordFormData.value.userId = rowData[keyField]!
              updatePasswordFormData.value.userName = rowData.userName!
              onOpen()
            },
            buttonProps: {
              textProp: () => t('dict.sys_operate_type.update_password'),
              type: 'info',
              size: 'small',
              auth: `system:${key}:pass:update`,
            },
            iconProps: {
              icon: 'mdi:update',
            },
          },
          {
            _builtInType: 'clearPass',
            _dropdown: true,
            _show: row => !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.ROOT) && !row.populated_rolesList?.map(i => i.roleName).includes(AppConstRoles.DEVELOPER),
            async onPresetClick(rowData) {
              const { confirmed } = await useAppConfirm(t('app.base.pass.clear.confirm', { userName: rowData.userName }))

              if (confirmed) {
                const res = await clearPasswordAPI({ _id: rowData[keyField]! })

                if (res) {
                  useAppMsgSuccess()
                  await onApiList()
                }
              }
            },
            buttonProps: {
              textProp: () => t('dict.sys_operate_type.clear_password'),
              type: 'warning',
              size: 'small',
              auth: `system:${key}:pass:clear`,
            },
            iconProps: {
              icon: 'mdi:lock-reset',
            },
          },
        ],
      },
    ],
  },

  formProps: {
    localeUniqueKey: key,
    localeWithTable: true,
    dialogPreset: 'drawer',
    baseRules: true,
    labelWidth: 140,
    xGap: 0,

    schemas: [
      {
        type: 'Base:Input',
        formProp: {
          path: 'userName',
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
        type: 'Extend:RoleSelect',
        formProp: {
          path: 'roles',
          labelHelpMessage: true,
        },
        componentProp: {
          multiple: true,
        },
      },
    ],
  },
})

async function onYes(_: any, done: () => void) {
  try {
    await userStoreAuth.updatePasswordWithOpaqueForAdmin({
      userId: updatePasswordFormData.value.userId,
      userName: updatePasswordFormData.value.userName,
      newPassword: updatePasswordFormData.value.newPassword,
    })
    useAppMsgSuccess()
    resetPasswordFormData()
    await onApiList()
  }
  finally {
    done()
  }
}
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.SystemUser} -->
    <WCRUD @hook="register" />

    <WForm :model="updatePasswordFormData" @hook="registerUpdatePassword" />
  </div>
</template>
