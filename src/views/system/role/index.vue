<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { roleAPI } from '@/api/system/role'
import { useMenuTree } from './useMenuTree'

defineOptions({
  name: 'Role',
})

// locale unique key
const key = 'role'
const keyField = '_id'

const { getLeftMenu } = useMenuTree()

const [
  register,
  {
    onOpenCreateForm,
    onReadAndOpenUpdateForm,
    onGetActionType,
    onApiList,
  },
] = useCRUD<IModels.SystemRole>({
  baseAPI: roleAPI,

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
    ],

    auths: {
      list: `system:${key}:list`,
      create: `system:${key}:create`,
      read: `system:${key}:read`,
      update: `system:${key}:update`,
    },

    queryFormProps: {
      localeUniqueKey: key,
      localeWithTable: true,
      span: 6,
      showFeedback: false,
      labelWidth: 100,
      // query form schemas
      schemas: [
        {
          type: 'Base:Input',
          formProp: {
            path: 'roleName',
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
        key: 'roleName',
        width: 200,
        sorter: {
          multiple: 5,
          compare: 'default',
        },
      },

      {
        key: 'description',
        width: 200,
        ellipsis: {
          tooltip: true,
        },
      },

      {
        key: 'populated_usersCount',
        width: 120,
      },

      {
        ...WTablePresetOrderColumn,
        defaultSortOrder: 'ascend',
        sorter: {
          multiple: 4,
          compare: 'default',
        },
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
          multiple: 2,
          compare: 'default',
        },
      },

      {
        ...WTablePresetUpdatedAtColumn,
        sorter: {
          multiple: 1,
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
            _show: row => row.roleName !== AppConstRoles.ROOT,
            async onPresetClick(rowData) {
              await onReadAndOpenUpdateForm(rowData[keyField]!)
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
    // create/update form schemas
    schemas: [
      {
        type: 'Base:Input',
        formProp: {
          path: 'roleName',
          labelHelpMessage: true,
        },
        componentProp: {
          clearable: true,
          disabled: computed((): boolean => onGetActionType().value === 'update'),
        },
      },
      {
        type: 'Base:Input',
        formProp: {
          path: 'description',
        },
        componentProp: {
          clearable: true,
          type: 'textarea',
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
        type: 'Base:Tree',
        formProp: {
          path: 'menus',
          rule: false,
          labelHelpMessage: true,
        },
        componentProp: {
          presetPrefixIcon: true,
          toolbar: true,
          multiple: true,
          maxHeight: '600px',
          defaultValue: [],

          treeProps: {
            // @ts-expect-error tree data
            data: getLeftMenu,
            blockLine: true,
            blockNode: true,
            keyField,
            labelField: 'title',
            renderLabel: ({ option }) =>
              option.type === AppConstMenuType.ELEMENT
                ? ((option as unknown as IModels.SystemMenu).meta.permission as string)
                : (option.title as string),
          },
        },
      },
    ],
  },
})
</script>

<template>
  <div>
    <!-- @vue-generic {IModels.SystemRole} -->
    <WCRUD @hook="register" />
  </div>
</template>
