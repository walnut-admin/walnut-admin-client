<script lang="ts" setup>
import type { IModels } from '@/api/models'
import type { WAvatarUploadInst } from '@/components/Business/AvatarUpload'
import { omit, pick } from 'lodash-es'
import { updateProfileAPI } from '@/api/system/user'
import WAvatar from '../components/avatar.vue'

defineOptions({
  name: 'WAccountSettingsTabInfo',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreProfile = useAppStoreUserProfile()

const avatarUploadRef = useTemplateRef<WAvatarUploadInst>('avatarUploadRef')
const formData = ref<IModels.SystemUser>({
  ...pick(userStoreProfile.profile, [
    '_id',
    'userName',
    'nickName',
    'description',
    'gender',
    'avatar',
  ]),
})

const loading = ref(false)
const tempAvatar = ref()

const [register] = useForm<typeof formData.value>({
  localeUniqueKey: 'userInfo',
  baseRules: true,
  labelWidth: 120,

  disabled: computed(() => loading.value),

  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        path: 'userName',
      },
      componentProp: {},
    },
    {
      type: 'Base:Input',
      formProp: {
        path: 'nickName',
      },
      componentProp: {},
    },
    {
      type: 'Base:Input',
      formProp: {
        path: 'description',
        rule: false,
      },
      componentProp: {
        type: 'textarea',
      },
    },
    {
      type: 'Business:Dict',
      formProp: {
        path: 'gender',
        label: true,
        rule: false,
      },
      componentProp: {
        dictType: 'gbt_sex',
        renderType: 'radio',
        componentProps: {
          button: true,
        },
      },
    },
    {
      type: 'Base:Button',
      componentProp: {
        textProp: () => t('form.userInfo.submit'),
        type: 'primary',
        loading: computed(() => loading.value),
        disabled: computed(() => loading.value),
        debounce: 500,
        onClick: async () => {
          loading.value = true

          try {
            // TODO upload refactor
            // upload avatar and get real avatar url
            const isAvatarUploadSuccess
              = await avatarUploadRef.value?.onOSSUpload()

            if (!isAvatarUploadSuccess)
              return

            // set the new avatar url

            await updateProfileAPI(omit(formData.value, ['_id']))
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
  <n-grid x-gap="12" :cols="2">
    <n-gi>
      <WForm :model="formData" @hook="register" />
    </n-gi>

    <n-gi>
      <div class="vstack items-center justify-center">
        <WAvatar :value="tempAvatar || formData.avatar" :size="240" />

        <WAvatarUpload
          ref="avatarUploadRef"
          class="mt-4"
          @change="(url) => tempAvatar = url"
          @success="(url) => formData.avatar = url"
        />
      </div>
    </n-gi>
  </n-grid>
</template>
