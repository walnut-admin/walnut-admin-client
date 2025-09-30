<script lang="ts" setup>
import type { IStoreUser } from '@/store/types'
import { updatePreferenceBasicAPI } from '@/api/system/user_preference'

defineOptions({
  name: 'WAccountSettingsTabPreferenceBasic',
  defaultView: false,
})

const userStoreProfile = useAppStoreUserProfile()
const userStorePreference = useAppStoreUserPreference()
const appStoreLocale = useAppStoreLocale()

const { t } = useAppI18n()

const loading = ref(false)

const [register] = useForm<IStoreUser.Preference.Basic>({
  inline: true,
  labelWidth: 100,

  disabled: computed(() => loading.value),
  schemas: [
    {
      type: 'Base:Select',
      formProp: {
        path: 'locale',
        label: computed(() => t('app.base.language')),
      },
      componentProp: {
        options: Object.values(appStoreLocale.getLangList),
      },
    },
    {
      type: 'Base:Button',
      componentProp: {
        textProp: () => t('app.base.save'),
        type: 'primary',
        loading: computed(() => loading.value),
        disabled: computed(() => loading.value),
        onClick: async () => {
          loading.value = true

          try {
            await updatePreferenceBasicAPI(userStorePreference.basic)
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
  <div class="w-3/5">
    <WForm :model="userStorePreference.basic" @hook="register" />
  </div>
</template>
