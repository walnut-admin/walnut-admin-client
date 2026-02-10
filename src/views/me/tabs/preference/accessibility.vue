<script lang="ts" setup>
import type { IStoreUser } from '@/store/types'
import { updateAccessibilityPreferenceAPI } from '@/api/system/user_preference'

defineOptions({
  name: 'WMeTabPreferenceAccessibility',
  defaultView: false,
})

const userStoreProfile = useAppStoreUserProfile()
const userStorePreference = useAppStoreUserPreference()
const appStoreAdapter = useAppStoreAdapter()
const { t } = useAppI18n()

const loading = ref(false)

const [register] = useForm<IStoreUser.Preference.Accessibility>({
  inline: true,
  labelPlacement: appStoreAdapter.isMobile ? 'top' : 'left',
  labelAlign: appStoreAdapter.isMobile ? 'left' : 'right',
  labelWidth: 120,

  disabled: computed(() => loading.value),
  schemas: [
    {
      type: 'Raw:Slider',
      formProp: {
        path: 'fontSize',
      },
      componentProp: {
        step: 'mark',
        min: 12,
        max: 20,
        marks: {
          12: '12px',
          14: '14px',
          16: '16px',
          18: '18px',
          20: '20px',
        },
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'reducedMotion',
      },
      componentProp: {},
    },
    {
      type: 'Base:Select',
      formProp: {
        path: 'colorMode',
      },
      componentProp: {
        options: Object.values(AppConstColorMode).map(i => ({
          value: i,
          label: i,
        })),
      },
    },
    {
      type: 'Base:Select',
      formProp: {
        path: 'CVD',
      },
      componentProp: {
        clearable: true,
        options: Object.values(AppConstCVD).map(i => ({
          value: i,
          label: i,
        })),
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
            await updateAccessibilityPreferenceAPI(userStorePreference.accessibility)
            useAppMsgSuccess()
            await userStoreProfile.getProfile()
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
  <div class="w-2/5 max-lg:w-full">
    <WForm :model="userStorePreference.accessibility" @hook="register" />
  </div>
</template>
