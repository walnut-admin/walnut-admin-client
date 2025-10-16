<script lang="ts" setup>
import type { StringOrNumber } from 'easy-fns-ts'

import type { IAppSystemMenuForm } from './types'
import type { IModels } from '@/api/models'
import type { WForm } from '@/components/UI/Form'
import { omit } from 'lodash-es'
import { menuAPI } from '@/api/system/menu'
import { useTree } from '@/components/UI/Tree'
import { objectToPaths, pathsToObject } from '@/utils/shared'
import { useMenuTree } from '../role/useMenuTree'
import { useMenuFormSchema } from './useMenuFormSchema'

defineOptions({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Menu',
})

const keyField = '_id'

const { t } = useAppI18n()

// ref
const actionType = ref<IActionType>('create')
const targetTreeItem = ref<string>('')

const loading = ref(false)

// state
const { stateRef: formData, resetState: resetFormData, commit } = useState<IAppSystemMenuForm>({
  'type': 'catalog',

  'path': null,
  'name': null,
  'component': null,
  'title': null,
  'icon': null,

  'meta.status': true,
  'meta.order': 0,
  'meta.ternal': 'none',
  'meta.url': null,
  'meta.cache': true,
  'meta.show': true,
  'meta.affix': false,
  'meta.permission': null,
  'meta.menuActiveName': null,
  'meta.menuActiveSameTab': false,
  'meta.activeIcon': null,
  'meta.badge': null,
  'meta.position': false,
  'meta.leaveTip': false,
  'meta.maskUrl': false,
  'meta.hijackRefresh': false,
  'meta.watermark': {},
  'meta.transition': 'fade',
})

commit()

const { getLeftMenu, getTreeSelect, onInit, menuActiveNamesOptions }
  = useMenuTree()

const [registerTree] = useTree<IModels.SystemMenu>({
  presetPrefixIcon: true,
  presetContextMenu: true,
  deletable: true,
  toolbar: true,
  maxHeight: '75vh',

  auths: {
    delete: 'system:menu:delete',
    update: 'system:menu:update',
  },

  onTreeNodeItemDelete: async (deleted) => {
    await menuAPI.delete(deleted[keyField]!)
    useAppMsgSuccess()
    await onInit()
    targetTreeItem.value = ''
    resetFormData()
  },

  onPaste(copy, current) {
    // paste is just reset the pid, also need to remove some fields
    resetFormData()

    const safeCopy = omit(copy, [keyField, 'children'])

    formData.value = objectToPaths({
      ...safeCopy,
      pid: current[keyField],
    })

    targetTreeItem.value = ''
    actionType.value = 'create'
  },

  treeProps: {
    data: getLeftMenu as unknown as any[],
    keyField,
    blockLine: true,
    blockNode: true,
    disabled: computed(() => loading.value),

    filter: (pattern, node) => {
      const text = node.type === AppConstMenuType.ELEMENT
        ? ((node as unknown as IModels.SystemMenu).meta.permission as string)
        : (node.title as string)

      if (text && (text as string).toLowerCase().includes(pattern)) {
        return true
      }

      return false
    },

    renderLabel: ({ option }) =>
      option.type === AppConstMenuType.ELEMENT
        ? ((option as unknown as IModels.SystemMenu).meta.permission as string)
        : (option.title as string),
  },
})

// schemas
const schemas = useMenuFormSchema(
  actionType,
  formData,
  getTreeSelect,
  menuActiveNamesOptions,
  t,
)

// form
const [register, { validate, restoreValidation }] = useForm<IAppSystemMenuForm>({
  localeUniqueKey: 'menu',

  labelWidth: 140,

  span: 12,

  baseRules: true,

  disabled: computed(() => loading.value),

  schemas: [
    ...schemas,

    {
      type: 'Base:ButtonGroup',
      gridProp: {
        span: 24,
      },
      componentProp: {
        groups: [
          {
            textProp: () => t('app.base.save'),
            type: 'primary',
            auth: computed(() => `system:menu:${actionType.value}`),
            loading,
            disabled: loading,
            onClick: async () => {
              const isValid = await validate()

              if (!isValid)
                return

              loading.value = true

              try {
                await menuAPI[actionType.value](pathsToObject<typeof formData.value, IModels.SystemMenu>(formData.value))
                useAppMsgSuccess()
                await onInit()
              }
              finally {
                loading.value = false
              }
            },
          },
          {
            textProp: () => t('app.base.reset'),
            auth: computed(() => `system:menu:${actionType.value}`),
            loading,
            disabled: loading,
            onClick: async () => {
              await restoreValidation()
            },
          },
        ],
      },
    },
  ] as WForm.Schema.Item<IAppSystemMenuForm>[],
})

async function onUpdateTreeValue(v?: StringOrNumber | StringOrNumber[]) {
  if (!v) {
    actionType.value = 'create'
    resetFormData()
  }
  else {
    const res = await menuAPI.read(v as string)
    actionType.value = 'update'
    formData.value = objectToPaths(res, ['watermark'])
  }

  restoreValidation()
}
</script>

<template>
  <n-grid :x-gap="12">
    <n-gi :span="6">
      <n-card
        :segmented="{
          content: true,
          footer: 'soft',
        }"
      >
        <template #default>
          <!-- @vue-generic {IModels.SystemMenu} -->
          <WTree v-model:value="targetTreeItem" @hook="registerTree" @update:value="onUpdateTreeValue" />
        </template>
      </n-card>
    </n-gi>

    <n-gi :span="18">
      <n-card
        :segmented="{
          content: true,
          footer: 'soft',
        }"
      >
        <template #default>
          <n-alert v-if="!targetTreeItem" :title="t('page.menu.alert')" type="info" class="mb-4" />

          <div v-show="actionType">
            <!-- @vue-generic {IAppSystemMenuForm} -->
            <WForm :model="formData" @hook="register" />
          </div>
        </template>
      </n-card>
    </n-gi>
  </n-grid>
</template>
