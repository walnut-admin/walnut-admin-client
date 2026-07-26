<script lang="ts" setup>
import { getCanAnimate, modalColor } from './shared'

defineOptions({
  name: 'WCompGlobalDevSettingsHeader',
})

const appStoreSettingDev = useAppStoreSettingDev()

const headerRelatives = appStoreSettingDev.header

const [register] = useForm<typeof headerRelatives>({
  localeUniqueKey: 'app.settings.header',
  showFeedback: false,
  xGap: 0,
  formItemClass: 'flex flex-row justify-between mb-2',
  formItemComponentClass: '!w-32 flex justify-end',
  size: 'small',
  disabled: computed(() => !headerRelatives.status),
  schemas: [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.header',
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
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'transition',
      },
      componentProp: {
        disabled: computed(
          () => !headerRelatives.status || getCanAnimate.value,
        ),
        tooltip: true,
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'height',
      },
      componentProp: {
        step: 0.1,
        min: 0,
        suffix: 'rem',
        showButton: false,
        precision: 2,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'scrollUpShow',
      },
      componentProp: {
        disabled: computed(() => headerRelatives.fixed),
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'liveOnHover',
      },
      componentProp: {
        disabled: computed(() => headerRelatives.fixed || !headerRelatives.scrollUpShow),
      },
    },
  ],
})
</script>

<template>
  <WForm :model="headerRelatives" @hook="register" />
</template>
