<script lang="tsx" setup>
import type { IRequestPayload } from '@/api/request'
// TODO 111
import { NButton, NCheckbox } from 'naive-ui'
import { getNeedCapAPI } from '@/api/security/cap'

defineOptions({
  name: 'SignInWithAccount',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()
const appStoreNaive = useAppStoreNaive()
const compStoreCapJS = useStoreCompCapJS()
const appStoreBackendSettings = useAppStoreSettingBackend()

const accountFormData = ref<IRequestPayload.Auth.Password>({
  userName: '',
  password: '',
  rememberMe: true,
})

async function onSignIn() {
  userStoreAuth.setLoading(true)

  try {
    await userStoreAuth.AuthWithOpaque(accountFormData.value)

    // close demonstrate notification
    appStoreNaive.destroyAllNotiInst()
  }
  finally {
    userStoreAuth.setLoading(false)
  }
}

async function onSubmit() {
  // eslint-disable-next-line ts/no-use-before-define
  const valid = await validate()

  if (!valid)
    return

  userStoreAuth.setLoading(true)
  try {
    const needCap = await getNeedCapAPI('userName', accountFormData.value.userName)

    if (needCap) {
      await compStoreCapJS.onOpenCapModal(async () => {
        await onSignIn()
      })
    }
    else {
      await onSignIn()
    }
  }
  finally {
    userStoreAuth.setLoading(false)
  }
}

function onForgetPassword() {
  useAppMsgSuccess('Forget password')
}

const [register, { validate }] = useForm<typeof accountFormData.value>({
  localeUniqueKey: 'app.auth',
  baseRules: true,
  showLabel: false,
  xGap: 0,
  disabled: computed(() => userStoreAuth.getLoading!),
  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        path: 'userName',
        ruleType: 'string',
      },
      componentProp: {
        clearable: true,
        inputProps: {
          autocomplete: 'username',
        },
      },
      transitionProp: {
        transitionName: 'fade-left-big',
        duration: 500,
      },
    },
    {
      type: 'Extra:Password',
      formProp: {
        path: 'password',
        ruleType: 'string',
      },
      componentProp: {
        onSubmit,
      },
      transitionProp: {
        transitionName: 'fade-left-big',
        duration: 700,
      },
    },
    {
      type: 'Base:Render',
      formProp: {
        showFeedback: false,
      },
      componentProp: {
        render: ({ formData }) => (
          <div class="w-full hstack justify-between -mt-2">
            <NCheckbox v-model={[formData.rememberMe, 'checked']}>
              {t('form.app.auth.remember')}
            </NCheckbox>

            {appStoreBackendSettings.getOpaqueForgetEnabled && (
              <NButton
                text
                size="small"
                type="tertiary"
                onClick={onForgetPassword}
                disabled={userStoreAuth.getLoading!}
              >
                {t('form.app.auth.forget')}
              </NButton>
            )}
          </div>
        ),
      },
      transitionProp: {
        transitionName: 'fade-left-big',
        duration: 900,
      },
    },
    {
      type: 'Base:Button',
      formProp: {
        showFeedback: false,
      },
      componentProp: {
        textProp: () => (
          <span class="text-lg text-light-800 font-black uppercase">
            {t('app.base.signin')}
          </span>
        ),
        loading: computed(() => userStoreAuth.getLoading!),
        disabled: computed(() => userStoreAuth.getLoading!),
        class:
          'w-full rounded-full !bg-gradient-to-r !from-cyan-500 !to-blue-500',
        onClick: onSubmit,
      },
      transitionProp: {
        transitionName: 'fade-left-big',
        duration: 1100,
      },
    },
  ],
})

function setFormData(userName: string, password: string) {
  accountFormData.value.userName = userName
  accountFormData.value.password = password
}

onMounted(() => {
  if (userStoreAuth.getRemember) {
    setFormData(userStoreAuth.getRemember!.userName!, userStoreAuth.getRemember!.password!)
  }
})

defineExpose({
  setFormData,
})
</script>

<template>
  <WForm :model="accountFormData" @hook="register" />
</template>
