<script lang="ts" setup>
import { getCanAnimate, modalColor } from './shared'

defineOptions({
  name: 'WCompGlobalDevSettingsFooter',
})

const appStoreSettingDev = useAppStoreSettingDev()

const footerRelatives = appStoreSettingDev.footer

const [register] = useForm<typeof footerRelatives>({
  localeUniqueKey: 'app.settings.footer',
  showFeedback: false,
  xGap: 0,
  formItemClass: 'flex flex-row justify-between mb-2',
  formItemComponentClass: '!w-32 flex justify-end',
  size: 'small',
  disabled: computed(() => !footerRelatives.status),
  schemas: [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.footer',
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
        step: 0.1,
        min: 0,
        suffix: 'rem',
        showButton: false,
        precision: 2,
      },
    },

    {
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'transition',
      },
      componentProp: {
        disabled: computed(
          () => !footerRelatives.status || getCanAnimate.value,
        ),
        tooltip: true,
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'content',
      },
    },
  ],
})
</script>

<template>
  <WForm :model="footerRelatives" @hook="register" />
</template>
