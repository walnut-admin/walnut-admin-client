import type { TreeNodeItem } from 'easy-fns-ts'

import type { IAppSystemMenuForm } from './types'
import type { WForm } from '@/components/UI/Form'

import { findPath } from 'easy-fns-ts'
// TODO 111
import WRadio from '@/components/UI/Radio'
import { getViewsOptions, menuTernalOptions, menuTypeOptions } from './utils'

export function useMenuFormSchema(
  actionType: Ref<IActionType>,
  formData: Ref<IAppSystemMenuForm>,
  treeData: ComputedRef<TreeNodeItem<AppSystemMenu>[] | undefined>,
  menuActiveNamesOptions: Ref<Pick<AppSystemMenu, 'title' | 'name'>[]>,
) {
  // get view options and name options
  const { viewOptions, nameOptions } = getViewsOptions()

  // get node item from tree data
  const getCurrentNode = computed(
    () =>
      treeData.value
      && findPath<IAppSystemMenuForm>(
        treeData.value,
        n => n._id === formData.value.pid,
      ),
  )

  // for path prefix, better experience
  const getRoutePathPrefix = computed(() =>
    !getCurrentNode.value
      ? '/'
      : `${(getCurrentNode.value as IAppSystemMenuForm[])
        .map(item => item.path)
        .join('/')}/`,
  )

  return [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'form.menu.divider1',
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'type',
      },
      componentProp: {
        render: ({ formData }) => (
          <WRadio
            v-model={[formData.type, 'value']}
            options={menuTypeOptions}
          >
            {formData.type}
          </WRadio>
        ),
      },
    },

    {
      type: 'Base:TreeSelect',
      formProp: {
        path: 'pid',
      },
      componentProp: {
        treeSelectProps: {
          options: treeData ?? [],
          keyField: '_id',
          labelField: 'title',
        },
      },
    },

    {
      type: 'Business:Dict',
      formProp: {
        path: 'meta.status',
        label: 'status',
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
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'form.menu.divider2',
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'path',
      },
      componentProp: {
        clearable: true,
        prefix: getRoutePathPrefix,
        prefixClass: 'text-gray-5',
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    // when type is `catalog`, it's just input
    {
      type: 'Base:Input',
      formProp: {
        path: 'name',
        labelHelpMessage: true,
      },
      componentProp: {
        clearable: true,
        valueModifiers: {
          capitalize: true,
        },
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT
          && (formData.type === AppConstMenuType.CATALOG || formData['meta.ternal'] !== AppConstMenuTernal.NONE),
      },
    },

    // when type is `menu`, it's select
    {
      type: 'Base:Select',
      formProp: {
        path: 'name',
        labelHelpMessage: true,
      },
      componentProp: {
        clearable: true,
        filterable: true,
        disabled: true,
        options: nameOptions,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT
          && (formData.type === AppConstMenuType.MENU && formData['meta.ternal'] === AppConstMenuTernal.NONE),
      },
    },

    // Auto bump `views` children vue file
    // To avoid to appear in options, you can set `defaultView: false` in the same level of `setup`
    {
      type: 'Base:Select',
      formProp: {
        path: 'component',
        labelHelpMessage: true,
      },
      componentProp: {
        clearable: true,
        options: viewOptions,
        filterable: true,
        tooltip: true,
        onUpdateValue: (val: string) => {
          // Get the name property automatically from vue `name` property
          const target = viewOptions.find(item => item.value === val)
          formData.value = Object.assign(formData.value, { name: target?.name })
        },
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type === AppConstMenuType.MENU && formData['meta.ternal'] === AppConstMenuTernal.NONE,
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'form.menu.divider3',
      },
    },

    {
      type: 'Extra:LocaleSelect',
      formProp: {
        path: 'title',
        label: 'title',
        labelHelpMessage: true,
      },
      componentProp: {
        // key start with `sys.menu.` are all menu title
        prefix: 'sys.menu.',
        presetKey: 'sys.menu.',
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Extra:IconPicker',
      formProp: {
        path: 'icon',
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'meta.order',
        label: 'order',
      },
      componentProp: {
        clearable: true,
      },
    },

    {
      type: 'Base:Radio',
      formProp: {
        path: 'meta.ternal',
      },
      componentProp: {
        options: menuTernalOptions,
      },
      visibleProp: {
        vIf: ({ formData }) =>
          formData.type === AppConstMenuType.MENU
          && actionType.value === 'create',
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'meta.url',
      },
      componentProp: {
        clearable: true,
      },
      visibleProp: {
        vIf: ({ formData }) =>
          formData.type === AppConstMenuType.MENU
          && formData['meta.ternal'] !== AppConstMenuTernal.NONE,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'meta.cache',
        labelHelpMessage: true,
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) =>
          formData.type === AppConstMenuType.MENU
          && formData['meta.ternal'] !== AppConstMenuTernal.EXTERNAL,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'meta.show',
        labelHelpMessage: true,
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'meta.affix',
        labelHelpMessage: true,
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type === AppConstMenuType.MENU,
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'meta.permission',
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type === AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Base:Select',
      formProp: {
        path: 'meta.menuActiveName',
        rule: false,
      },
      componentProp: {
        options: computed(() =>
          menuActiveNamesOptions.value.map(i => ({
            value: i.name,
            label: AppI18n().global.t(i.title!),
          })),
        ),
        filterable: true,
        clearable: true,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type === AppConstMenuType.MENU,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'meta.menuActiveSameTab',
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) =>
          formData.type === AppConstMenuType.MENU && !!formData['meta.menuActiveName'],
      },
    },

    {
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'meta.animationName',
        rule: false,
      },
      componentProp: {
        clearable: true,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type === AppConstMenuType.MENU,
      },
    },

    {
      type: 'Extra:IconPicker',
      formProp: {
        path: 'meta.activeIcon',
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'meta.badge',
        rule: false,
      },
      componentProp: {
        clearable: true,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type !== AppConstMenuType.ELEMENT,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'meta.position',
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type === AppConstMenuType.MENU,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'meta.leaveTip',
        rule: false,
      },
      visibleProp: {
        vIf: ({ formData }) => formData.type === AppConstMenuType.MENU,
      },
    },
  ] as WForm.Schema.Item<IAppSystemMenuForm>[]
}
