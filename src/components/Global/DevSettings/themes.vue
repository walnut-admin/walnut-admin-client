<script lang="tsx" setup>
import AppSettingsDevColors from './colors'
import { modalColor } from './shared'

defineOptions({
  name: 'WCompGlobalDevSettingsThemes',
})

const appStoreSettingDev = useAppStoreSettingDev()

const themeRelatives = appStoreSettingDev.themes

const lightThemeRelatives = ref(themeRelatives.light)
const darkThemeRelatives = ref(themeRelatives.dark)

const [register] = useForm<typeof lightThemeRelatives.value>({
  showFeedback: false,
  xGap: 0,
  formItemClass: 'mb-2',
  formItemComponentClass: '',
  size: 'small',
  schemas: [
    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme',
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
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme.primary',
        titlePlacement: 'center',
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'primaryColor',
      },
      componentProp: {
        render: ({ formData }) => (
          <AppSettingsDevColors v-model={[formData.primaryColor, 'value']}></AppSettingsDevColors>
        ),
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme.info',
        titlePlacement: 'center',
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'infoColor',
      },
      componentProp: {
        render: ({ formData }) => (
          <AppSettingsDevColors v-model={[formData.infoColor, 'value']}></AppSettingsDevColors>
        ),
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme.success',
        titlePlacement: 'center',
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'successColor',
      },
      componentProp: {
        render: ({ formData }) => (
          <AppSettingsDevColors v-model={[formData.successColor, 'value']}></AppSettingsDevColors>
        ),
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme.warning',
        titlePlacement: 'center',
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'warningColor',
      },
      componentProp: {
        render: ({ formData }) => (
          <AppSettingsDevColors v-model={[formData.warningColor, 'value']}></AppSettingsDevColors>
        ),
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme.error',
        titlePlacement: 'center',
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'errorColor',
      },
      componentProp: {
        render: ({ formData }) => (
          <AppSettingsDevColors v-model={[formData.errorColor, 'value']}></AppSettingsDevColors>
        ),
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme.body',
        titlePlacement: 'center',
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'bodyColor',
      },
      componentProp: {
        render: ({ formData }) => (
          <AppSettingsDevColors v-model={[formData.bodyColor, 'value']}></AppSettingsDevColors>
        ),
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.theme.inverted',
        titlePlacement: 'center',
        helpMessage: true,
      },
    },

    {
      type: 'Base:Render',
      formProp: {
        path: 'invertedColor',
      },
      componentProp: {
        render: ({ formData }) => (
          <AppSettingsDevColors
            v-model={[formData.invertedColor, 'value']}
            disabled={isDark.value}
          >
          </AppSettingsDevColors>
        ),
      },
    },
  ],
})
</script>

<template>
  <!-- @vue-generic {typeof darkThemeRelatives.value} -->
  <WForm
    v-if="isDark"
    :model="darkThemeRelatives"
    @hook="register"
  />

  <!-- @vue-generic {typeof lightThemeRelatives.value} -->
  <WForm
    v-else
    :model="lightThemeRelatives"
    @hook="register"
  />
</template>
