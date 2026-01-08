<script lang="tsx" setup>
import type { NullableRecord } from 'easy-fns-ts'
import type { IRequestPayload } from '@/api/request'
// TODO 111
import { NRadio, NText } from 'naive-ui'
import { sendAuthEmailAPI } from '@/api/auth/email'
import { getNeedCapAPI } from '@/api/security/cap'
import { mainoutConst } from '@/router/routes/mainout'
import { isEmailAddress } from '@/utils/regex'
import { openExternalLink } from '@/utils/window/open'

defineOptions({
  transitionName: 'SignInWithEmail',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()
const appStoreNaive = useAppStoreNaive()
const compStoreCapJS = useStoreCompCapJS()

const emailFormData = reactive<NullableRecord<IRequestPayload.Auth.Email.Verify & { agree: string }>>({
  emailAddress: null,
  verifyCode: null,
  agree: null,
})

async function onSignIn() {
  userStoreAuth.setLoading(true)

  try {
    await userStoreAuth.AuthWithEmailAddress({
      emailAddress: emailFormData.emailAddress!,
      verifyCode: +emailFormData.verifyCode!,
    })

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

  if (!emailFormData.agree) {
    useAppMsgWarning(t('app.auth.service.warning'))
    return
  }

  await onSignIn()
}

const [register, { validate }] = useForm<typeof emailFormData>({
  localeUniqueKey: 'app.auth',
  baseRules: true,
  showLabel: false,
  xGap: 0,
  disabled: computed(() => userStoreAuth.getLoading!),
  schemas: [
    {
      type: 'Extra:EmailInput',
      formProp: {
        path: 'emailAddress',
        ruleType: 'string',
        first: true,
        locale: false,
        label: computed(() => t('app.base.emailAddress')),
        rule: [
          {
            key: 'emailAddress',
            type: 'string',
            trigger: ['input', 'change'],
            validator: (rule, value) => {
              // to call base rule
              if (!value)
                return Promise.resolve()

              if (!isEmailAddress(value))
                return Promise.reject(t('app.base.emailAddress.rule'))

              return Promise.resolve()
            },
          },
        ],
      },
      componentProp: {
        clearable: true,
      },
      transitionProp: {
        transitionName: 'fade-up-big',
        duration: 500,
      },
    },
    {
      type: 'Extra:VerifyCode',
      formProp: {
        path: 'verifyCode',
        ruleType: 'string',
        label: computed(() => t('app.base.verifyCode')),
        locale: false,
      },
      componentProp: {
        retryKey: 'auth-email',

        onBeforeCountdown: async () => {
          // valid emailAddress before count down
          const valid = await validate(['emailAddress'])

          if (!valid)
            return Promise.reject(new Error('EmailAddress Invalid'))

          userStoreAuth.setLoading(true)
          try {
            const needCap = await getNeedCapAPI('emailAddress', emailFormData.emailAddress!)

            if (needCap) {
              return new Promise<boolean>((resolve) => {
                compStoreCapJS.onOpenCapModal(async () => {
                  await sendAuthEmailAPI({
                    emailAddress: emailFormData.emailAddress!,
                  })
                  userStoreAuth.setLoading(false)
                  return resolve(true)
                })
              })
            }
            else {
              await sendAuthEmailAPI({
                emailAddress: emailFormData.emailAddress!,
              })
              userStoreAuth.setLoading(false)
              return Promise.resolve(true)
            }
          }
          catch (error) {
            userStoreAuth.setLoading(false)
            console.error(error)
          }
        },
      },
      transitionProp: {
        transitionName: 'fade-up-big',
        duration: 700,
      },
    },
    {
      type: 'Base:Render',
      formProp: {
        path: 'agree',
        rule: false,
        showFeedback: false,
      },
      componentProp: {
        render({ formData }) {
          return (
            <div
              class="bigger-click cursor-pointer -mt-4"
              onClick={(e: MouseEvent) => {
                e.preventDefault()
                formData.agree = formData.agree ? '' : 'agree'
              }}
            >
              <NRadio
                value="agree"
                checked={formData.agree === 'agree'}
                size="small"
              >
                <span class="ml-2 cursor-pointer break-all text-xs text-gray-500">
                  {t('form.app.auth.continue')}
                  <NText
                    type="info"
                    strong
                    // @ts-expect-error no onClick for NText
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation()
                      openExternalLink(mainoutConst.serviceAgreement.path)
                    }}
                  >
                    {' '}
                    {t('form.app.auth.sa')}
                    {' '}
                  </NText>
                  、
                  <NText
                    type="info"
                    strong
                    // @ts-expect-error no onClick for NText
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation()
                      openExternalLink(mainoutConst.privacyPolicy.path)
                    }}
                  >
                    {' '}
                    {t('form.app.auth.pp')}
                    {' '}
                  </NText>
                </span>
              </NRadio>
            </div>
          )
        },
      },
      transitionProp: {
        transitionName: 'fade-up-big',
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
          <span class="text-light-800">
            {t('app.base.signin')}
            {' '}
            /
            {t('app.base.signup')}
          </span>
        ),
        loading: computed(() => userStoreAuth.getLoading!),
        disabled: computed(
          () => !!emailFormData.agree && userStoreAuth.getLoading!,
        ),
        style: {
          width: '100%',
          fontSize: '18px',
          fontWeight: '900',
        },
        class:
            'm-auto uppercase rounded-full !bg-gradient-to-r !from-cyan-500 !to-blue-500',
        onClick: onSubmit,
      },
      transitionProp: {
        transitionName: 'fade-up-big',
        duration: 1100,
      },
    },
  ],
})
</script>

<template>
  <WForm :model="emailFormData" @hook="register" />
</template>
