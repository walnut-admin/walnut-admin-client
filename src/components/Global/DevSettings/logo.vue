<script lang="ts" setup>
import { getCanAnimate, modalColor } from './shared'

defineOptions({
  name: 'WCompGlobalDevSettingsLogo',
})

const appStoreSettingDev = useAppStoreSettingDev()

const logoRelatives = appStoreSettingDev.logo

const [register] = useForm<typeof logoRelatives>({
  localeUniqueKey: 'app.settings',
  showFeedback: false,
  xGap: 0,
  formItemClass: 'flex flex-row justify-between mb-2',
  formItemComponentClass: '!w-32 flex justify-end',
  size: 'small',
  schemas: [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.logo',
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
      componentProp: {
        disabled: computed(() => !logoRelatives.status),
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'status',
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'fixed',
      },
      componentProp: {
        disabled: computed(() => !logoRelatives.status),
      },
    },

    {
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'transition',
      },
      componentProp: {
        disabled: computed(
          () => !logoRelatives.status || getCanAnimate.value,
        ),
        tooltip: true,
      },
    },
  ],
})
</script>

<template>
  <WForm :model="logoRelatives" @hook="register" />
</template>
