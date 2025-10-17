<script lang="ts" setup>
import { modalColor } from './shared'

defineOptions({
  name: 'WCompGlobalDevSettingsApp',
})

const appStoreSettingDev = useAppStoreSettingDev()

const [register] = useForm<typeof appStoreSettingDev.app>({
  localeUniqueKey: 'app.settings.app',
  showFeedback: false,
  xGap: 0,
  formItemClass: 'flex flex-row justify-between mb-2',
  formItemComponentClass: '!w-32 flex justify-end',
  size: 'small',
  schemas: [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.app',
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
        path: 'keepAlive',
        labelHelpMessage: true,
      },
    },

    {
      type: 'Base:InputNumber',
      formProp: {
        path: 'contentPadding',
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
      type: 'Base:Select',
      formProp: {
        path: 'scrollMode',
      },
      componentProp: {
        clearable: true,
        options: Object.values(AppConstScrollMode).map(i => ({
          value: i,
          label: i,
        })),
      },
    },
  ],
})
</script>

<template>
  <WForm :model="appStoreSettingDev.app" @hook="register" />
</template>
