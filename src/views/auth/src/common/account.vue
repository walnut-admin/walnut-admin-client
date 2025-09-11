<script lang="tsx" setup>
// TODO 111
import { NButton, NCheckbox } from 'naive-ui'
import { getNeedCapAPI } from '@/api/app/capjs'
import { useAuthContext } from '../hooks/useAuthContext'

defineOptions({
  name: 'SignInWithAccount',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()
const appStoreNaive = useAppStoreNaive()
const compStoreCapJS = useStoreCompCapJS()

const { loading } = useAuthContext()

const accountFormData = ref<AppPayloadAuth.Password>({
  userName: '',
  password: '',
  rememberMe: true,
})

async function onSignIn() {
  loading.value = true

  try {
    await userStoreAuth.AuthWithBasicPassword(accountFormData.value)

    // close demonstrate notification
    appStoreNaive.destroyAllNotiInst()
  }
  finally {
    loading.value = false
  }
}

async function onSubmit() {
  // eslint-disable-next-line ts/no-use-before-define
  const valid = await validate()

  if (!valid)
    return

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

function onForgetPassword() {
  useAppMsgSuccess('Forget password')
}

const [register, { validate }] = useForm<typeof accountFormData.value>({
  localeUniqueKey: 'app.auth',
  baseRules: true,
  showLabel: false,
  xGap: 0,
  disabled: loading,
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
          <div class="mb-2 w-full hstack justify-between">
            <NCheckbox v-model={[formData.rememberMe, 'checked']}>
              {t('form.app.auth.remember')}
            </NCheckbox>

            <NButton
              text
              size="small"
              type="tertiary"
              onClick={onForgetPassword}
              disabled={loading.value}
            >
              {t('form.app.auth.forget')}
            </NButton>
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
        loading,
        disabled: loading,
        class:
          'w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mt-3',
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
  if (userStoreAuth.remember) {
    setFormData(userStoreAuth.remember.userName!, userStoreAuth.remember.password!)
  }
})

defineExpose({
  setFormData,
})
</script>

<template>
  <WForm :model="accountFormData" @hook="register" />
</template>
