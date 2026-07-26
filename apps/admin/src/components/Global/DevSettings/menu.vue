<script lang="ts" setup>
import { getCanAnimate, modalColor } from './shared'

defineOptions({
  name: 'WCompGlobalDevSettingsMenu',
})

const appStoreSettingDev = useAppStoreSettingDev()
const appStoreMenu = useAppStoreMenu()

const menuRelatives = appStoreSettingDev.menu

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
      type: 'Base:Input',
      formProp: {
        path: 'id',
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
      type: 'Base:InputNumber',
      formProp: {
        path: 'indent',
      },
      componentProp: {
        step: 0.1,
        min: 0,
        suffix: 'rem',
        showButton: false,
        precision: 2,
        disabled: computed(() => !menuRelatives.status || appStoreMenu.getCollapse),
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'width',
      },
      componentProp: {
        step: 0.1,
        min: 0,
        suffix: 'rem',
        showButton: false,
        precision: 2,
        disabled: computed(() => !menuRelatives.status || appStoreMenu.getCollapse),
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'iconSize',
      },
      componentProp: {
        step: 0.1,
        min: 0,
        suffix: 'rem',
        showButton: false,
        precision: 2,
        disabled: computed(() => !menuRelatives.status || appStoreMenu.getCollapse),
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'collapsedIconSize',
      },
      componentProp: {
        step: 0.1,
        min: 0,
        suffix: 'rem',
        showButton: false,
        precision: 2,
        disabled: computed(() => !menuRelatives.status || !appStoreMenu.getCollapse),
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'collapsedWidth',
      },
      componentProp: {
        step: 0.1,
        min: 0,
        suffix: 'rem',
        showButton: false,
        precision: 2,
        disabled: computed(() => !menuRelatives.status || !appStoreMenu.getCollapse),
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'accordion',
      },
    },
  ],
})
</script>

<template>
  <WForm :model="menuRelatives" @hook="register" />
</template>
