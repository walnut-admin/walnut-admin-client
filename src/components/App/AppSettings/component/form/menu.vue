<script lang="ts" setup>
import { getCanAnimate, modalColor } from '../../shared'

const appStoreMenu = useAppStoreMenu()

const appSetting = useAppStoreSetting()

const menuRelatives = appSetting.menu

const [register] = useForm<typeof menuRelatives>({
  localeUniqueKey: 'app.settings.menu',
  showFeedback: false,
  xGap: 0,
  formItemClass: 'flex flex-row justify-between mb-2',
  formItemComponentClass: '!w-32 flex justify-end',
  size: 'small',
  disabled: computed(() => !menuRelatives.status),
  schemas: [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.menu',
        prefix: 'bar',
        titlePlacement: 'left',
        foldable: true,
      },
      gridProp: {
        class: 'sticky top-0 z-10 py-2',
        style: {
          backgroundColor: modalColor,
        },
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'status',
      },
      componentProp: {
        disabled: false,
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        path: 'id',
      },
    },
    {
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'transition',
      },
      componentProp: {
        disabled: computed(
          () => !menuRelatives.status || getCanAnimate.value,
        ),
        tooltip: true,
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'inverted',
      },
      componentProp: {
        disabled: computed(() => !menuRelatives.status || isDark.value),
      },
    },
    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'width',
      },
      componentProp: {
        step: 1,
        min: 0,
        suffix: 'px',
        showButton: false,
        precision: 0,
        disabled: computed(() => !menuRelatives.status || appStoreMenu.getCollapse),
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'accordion',
      },
    },
    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'iconSize',
      },
      componentProp: {
        step: 1,
        min: 0,
        suffix: 'px',
        showButton: false,
        precision: 0,
        disabled: computed(() => !menuRelatives.status || appStoreMenu.getCollapse),
      },
    },
    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'indent',
      },
      componentProp: {
        step: 1,
        min: 0,
        suffix: 'px',
        showButton: false,
        precision: 0,
        disabled: computed(() => !menuRelatives.status || appStoreMenu.getCollapse),
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'collapseStatus',
      },
    },
    {
      type: 'Base:Select',
      formProp: {
        path: 'collapseMode',
      },
      componentProp: {
        options: Object.values(AppConstCollapseMode).map(i => ({
          value: i,
          label: i,
        })),
        disabled: computed(
          () => !menuRelatives.status || !menuRelatives.collapseStatus,
        ),
      },
    },
    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'collapsedIconSize',
      },
      componentProp: {
        step: 1,
        min: 0,
        suffix: 'px',
        showButton: false,
        precision: 0,
        disabled: computed(() => !menuRelatives.status || !appStoreMenu.getCollapse),
      },
    },
    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'collapsedWidth',
      },
      componentProp: {
        step: 1,
        min: 0,
        suffix: 'px',
        showButton: false,
        precision: 0,
        disabled: computed(() => !menuRelatives.status || !appStoreMenu.getCollapse),
      },
    },
  ],
})
</script>

<template>
  <WForm :model="menuRelatives" @hook="register" />
</template>
