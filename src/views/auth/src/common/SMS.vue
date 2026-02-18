<script lang="tsx" setup>
import type { NullableRecord } from 'easy-fns-ts'
import type { IRequestPayload } from '@/api/request'
import type { ICompExtraPhoneNumberInputUpdateParams } from '@/components/Extra/PhoneNumberInput'
// TODO 111
import { NRadio, NText } from 'naive-ui'
import { sendWithOTPAPI } from '@/api/auth/otp'
import { mainoutConst } from '@/router/routes/mainout'
import { isPhoneNumber } from '@/utils/regex'
import { openExternalLink } from '@/utils/window/open'

defineOptions({
  transitionName: 'SignInWithSMS',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()
const appStoreNaive = useAppStoreNaive()

const countryCallingCode = ref()
const SMSFormData = reactive<NullableRecord<IRequestPayload.Auth.OTP.Verify & { agree: string }>>({
  type: 'sms',
  identifier: null,
  verifyCode: null,
  agree: null,
})

async function onSignIn() {
  userStoreAuth.setLoading(true)

  try {
    await userStoreAuth.AuthWithPhoneNumber({
      type: SMSFormData.type!,
      identifier: SMSFormData.identifier!,
      verifyCode: SMSFormData.verifyCode!,
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

  if (!SMSFormData.agree) {
    useAppMsgWarning(t('app.auth.service.warning'))
    return
  }

  await onSignIn()
}

const [register, { validate }] = useForm<typeof SMSFormData>({
  localeUniqueKey: 'app.auth',
  baseRules: true,
  showLabel: false,
  xGap: 0,
  disabled: computed(() => userStoreAuth.getLoading!),
  schemas: [
    {
      type: 'Extra:PhoneNumberInput',
      formProp: {
        path: 'identifier',
        locale: false,
        first: true,
        label: computed(() => t('app.base.phoneNumber')),
        rule: [
          {
            key: 'identifier',
            type: 'string',
            trigger: ['change'],
            validator: (_rule, value) => {
              if (!isPhoneNumber(`+${countryCallingCode.value}${value}`))
                return Promise.reject(t('app.base.phoneNumber.rule'))

              return Promise.resolve()
            },
          },
        ],
      },
      componentProp: {
        preferred: true,
        example: true,
        autoDefaultCountry: true,
        onChange: (val: ICompExtraPhoneNumberInputUpdateParams) => {
          countryCallingCode.value = val.countryCallingCode
        },
      },
      transitionProp: {
        transitionName: 'fade-down-big',
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
        key: 'sms-verify-code',
        retryKey: 'auth-sms',

        onBeforeCountdown: async () => {
          // valid phoneNumber before count down
          const valid = await validate(['identifier'])

          if (!valid)
            return false

          userStoreAuth.setLoading(true)
          try {
            await sendWithOTPAPI({
              type: SMSFormData.type!,
              identifier: SMSFormData.identifier!,
            })
            userStoreAuth.setLoading(false)
            return true
          }
          catch (error) {
            console.error(error)
            return false
          }
          finally {
            userStoreAuth.setLoading(false)
          }
        },

      },
      transitionProp: {
        transitionName: 'fade-down-big',
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
        transitionName: 'fade-down-big',
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
          () => !!SMSFormData.agree && userStoreAuth.getLoading!,
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
        transitionName: 'fade-down-big',
        duration: 1100,
      },
    },
  ],
})
</script>

<template>
  <WForm :model="SMSFormData" @hook="register" />
</template>
