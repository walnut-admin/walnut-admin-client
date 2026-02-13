<script lang="ts" setup>
import type { IStoreUser } from '@/store/types'
import { updateLayoutPreferenceAPI } from '@/api/system/user_preference'
import { objectToPaths, pathsToObject } from '@/utils/shared'

defineOptions({
  name: 'WMeTabPreferenceLayout',
  defaultView: false,
})

const userStorePreference = useAppStoreUserPreference()
const appStoreAdapter = useAppStoreAdapter()

const { t } = useAppI18n()

const loading = ref(false)
const formModel = ref(objectToPaths(userStorePreference.layout))

const realFormData = computed(() => pathsToObject(formModel.value) as IStoreUser.Preference.Layout)
watchEffect(() => {
  userStorePreference.setLayout(realFormData.value)
})

const [register] = useForm<typeof formModel.value>({
  inline: true,
  labelPlacement: appStoreAdapter.isMobile ? 'top' : 'left',
  labelAlign: appStoreAdapter.isMobile ? 'left' : 'right',
  labelWidth: 120,
  span: 24,
  xGap: 10,

  disabled: computed(() => loading.value),
  schemas: [
    {
      type: 'Base:Select',
      formProp: {
        path: 'layoutMode',
      },
      componentProp: {
        options: Object.values(AppConstLayoutMode).map(i => ({
          value: i,
          label: i,
        })),
      },
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.header',
        titlePlacement: 'left',
        prefix: 'bar',
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'layout.header.inverted',
        label: computed(() => t('app.base.inverted')),
        labelHelpMessage: computed(() => t('preference.layout.inverted.helpMessage')),
      },
      componentProp: {
        disabled: computed(() => userStorePreference.getIsDark),
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.breadcrumb',
        titlePlacement: 'left',
        prefix: 'bar',
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'layout.breadcrumb.showIcon',
        label: computed(() => t('app.base.showIcon')),
      },
      componentProp: {},
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'layout.breadcrumb.showDropdown',
        label: computed(() => t('app.base.showDropdown')),
      },
      componentProp: {},
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.tab',
        titlePlacement: 'left',
        prefix: 'bar',
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'layout.tabs.inverted',
        label: computed(() => t('app.base.inverted')),
        labelHelpMessage: computed(() => t('preference.layout.inverted.helpMessage')),
      },
      componentProp: {
        disabled: computed(() => userStorePreference.getIsDark),
      },
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'layout.tabs.showIcon',
        label: computed(() => t('app.base.showIcon')),
      },
      componentProp: {},
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Base:Select',
      formProp: {
        path: 'layout.tabs.styleMode',
        label: computed(() => t('app.layout.tab.styleMode')),
      },
      componentProp: {
        options: Object.values(AppConstTabStyleMode).map(i => ({
          value: i,
          label: i,
        })),
      },
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Base:Select',
      formProp: {
        path: 'layout.tabs.closeMode',
        label: computed(() => t('app.layout.tab.closeMode')),
      },
      componentProp: {
        options: Object.values(AppConstTabCloseMode).map(i => ({
          value: i,
          label: i,
        })),
      },
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Base:Select',
      formProp: {
        path: 'layout.tabs.affixMode',
        label: computed(() => t('app.layout.tab.affixMode')),
      },
      componentProp: {
        options: Object.values(AppConstTabAffixMode).map(i => ({
          value: i,
          label: i,
        })),
      },
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.menu',
        titlePlacement: 'left',
        prefix: 'bar',
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'layout.menu.inverted',
        label: computed(() => t('app.base.inverted')),
        labelHelpMessage: computed(() => t('preference.layout.inverted.helpMessage')),
      },
      componentProp: {
        disabled: computed(() => userStorePreference.getIsDark),
      },
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Base:Select',
      formProp: {
        path: 'layout.menu.collapseMode',
        label: computed(() => t('app.layout.menu.collapseMode')),
      },
      componentProp: {
        options: Object.values(AppConstCollapseMode).map(i => ({
          value: i,
          label: i,
        })),
      },
      gridProp: {
        span: appStoreAdapter.isMobile ? 24 : 8,
      },
    },

    {
      type: 'Extend:Divider',
      componentProp: {
        title: 'app.settings.footer',
        titlePlacement: 'left',
        prefix: 'bar',
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        path: 'layout.footer.inverted',
        label: computed(() => t('app.base.inverted')),
        labelHelpMessage: computed(() => t('preference.layout.inverted.helpMessage')),
      },
      componentProp: {
        disabled: computed(() => userStorePreference.getIsDark),
      },
    },

    {
      type: 'Base:Button',
      componentProp: {
        textProp: () => t('app.base.save'),
        type: 'primary',
        loading: computed(() => loading.value),
        disabled: computed(() => loading.value),
        debounce: 500,
        onClick: async () => {
          loading.value = true

          try {
            await updateLayoutPreferenceAPI(realFormData.value)
            useAppMsgSuccess()
          }
          finally {
            loading.value = false
          }
        },
      },
    },
  ],
})
</script>

<template>
  <div class="w-4/5 max-lg:w-full">
    <WForm :model="formModel" @hook="register" />
  </div>
</template>
