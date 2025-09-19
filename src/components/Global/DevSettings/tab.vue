<script lang="ts" setup>
import { getCanAnimate, modalColor } from '@/components/App/AppSettings/shared'

defineOptions({
  name: 'WCompGlobalDevSettingsTab',
})

const appStoreSettingDev = useAppStoreSettingDev()

const tabRelatives = appStoreSettingDev.tabs

const [register] = useForm<typeof tabRelatives>({
  localeUniqueKey: 'app.settings.tab',
  showFeedback: false,
  xGap: 0,
  formItemClass: 'flex flex-row justify-between mb-2',
  formItemComponentClass: '!w-32 flex justify-end',
  size: 'small',
  disabled: computed(() => !tabRelatives.status),
  schemas: [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.tab',
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
      type: 'Base:Switch',
      formProp: {
        path: 'fixed',
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'height',
      },
      componentProp: {
        step: 1,
        min: 0,
        suffix: 'px',
        showButton: false,
        precision: 0,
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'itemWidth',
      },
      componentProp: {
        step: 1,
        min: 0,
        suffix: 'px',
        showButton: false,
        precision: 0,
      },
    },

    {
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'transition',
      },
      componentProp: {
        disabled: computed(() => !tabRelatives.status || getCanAnimate.value),
        tooltip: true,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'persistent',
      },
    },

    {
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'itemTransition',
      },
      componentProp: {
        tooltip: true,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'scrollUpShow',
      },
      componentProp: {
        disabled: computed(() => tabRelatives.fixed),
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'liveOnHover',
      },
      componentProp: {
        disabled: computed(() => tabRelatives.fixed || !tabRelatives.scrollUpShow),
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'showUtils',
      },
    },

    {
      type: 'Base:Select',
      formProp: {
        path: 'utilsMode',
        labelHelpMessage: true,
      },
      componentProp: {
        options: Object.values(AppConstTabUtilsShowMode).map(i => ({
          value: i,
          label: i,
        })),
        disabled: computed(
          () => !tabRelatives.status || !tabRelatives.showUtils,
        ),
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'contextMenu',
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'sortable',
      },
    },
  ],
})
</script>

<template>
  <WForm :model="tabRelatives" @hook="register" />
</template>
