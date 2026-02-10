<script lang="ts" setup>
import type { IStoreUser } from '@/store/types'
import { updateThemePreferenceAPI } from '@/api/system/user_preference'

defineOptions({
  name: 'WMeTabPreferenceTheme',
  defaultView: false,
})

const userStoreProfile = useAppStoreUserProfile()
const userStorePreference = useAppStoreUserPreference()
const appStoreAdapter = useAppStoreAdapter()

const { t } = useAppI18n()

const loading = ref(false)

const [register] = useForm<IStoreUser.Preference.Theme>({
  inline: true,
  labelPlacement: appStoreAdapter.isMobile ? 'top' : 'left',
  labelAlign: appStoreAdapter.isMobile ? 'left' : 'right',
  labelWidth: 120,

  disabled: computed(() => loading.value),
  schemas: [
    {
      type: 'Base:Switch',
      formProp: {
        path: 'dark',
      },
      componentProp: {},
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
            await updateThemePreferenceAPI(userStorePreference.theme)
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
    <WForm :model="userStorePreference.theme" @hook="register" />
  </div>
</template>
