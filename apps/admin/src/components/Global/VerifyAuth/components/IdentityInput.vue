<script lang="ts" setup>
import type { VerifyAuthMethod } from '../types'
import type { ICompExtraPhoneNumberInputUpdateParams } from '@/components/Extra/PhoneNumberInput'
import type { WForm } from '@/components/UI/Form'
import { isEmailAddress, isPhoneNumber } from '@/utils/regex'

/**
 * Step 2: Identity Input (Bind Mode)
 * Input phone number or email address for first-time binding
 * Uses WForm with schemas - consistent with otp.vue pattern
 */

defineOptions({
  name: 'WCompBusinessVerifyAuthIdentityInput',
})

const { t } = useAppI18n()

// Form data - using useState pattern from otp.vue
const { stateRef: formData } = useState({
  identifier: null as string | null,
})

// Country calling code for phone validation
const countryCallingCode = ref('')

const selectedMethod = inject<Ref<VerifyAuthMethod>>('selectedMethod')!

const type = computed(() => selectedMethod.value?.type)

/**
 * Get form schemas based on type
 */
const schemas = computed<WForm.Schema.Item<typeof formData.value>[]>(() => {
  const isPhone = type.value === 'sms'
  console.log(selectedMethod.value, 123)

  const baseSchemas: WForm.Schema.Item<typeof formData.value>[] = [
    isPhone
      ? {
          type: 'Extra:PhoneNumberInput',
          formProp: {
            path: 'identifier',
            locale: false,
            first: true,
            label: t('app.base.phoneNumber'),
            labelPlacement: 'top',
            labelAlign: 'left',
            rule: [
              {
                key: 'identifier',
                type: 'string',
                trigger: ['change'],
                validator: (_rule: any, value: string) => {
                  if (!isPhoneNumber(`+${countryCallingCode.value}${value}`))
                    return Promise.reject(t('app.base.phoneNumber.rule'))
                  return Promise.resolve()
                },
              },
            ],
          },
          componentProp: {
            key: 'sms',
            preferred: true,
            example: true,
            autoDefaultCountry: true,
            onChange: (val: ICompExtraPhoneNumberInputUpdateParams) => {
              countryCallingCode.value = val.countryCallingCode!
            },
          },
          transitionProp: {
            transitionName: 'fade-down-big',
            duration: 500,
          },
        } as WForm.Schema.Item<typeof formData.value>
      : {
          type: 'Extra:EmailInput',
          formProp: {
            path: 'identifier',
            ruleType: 'string',
            first: true,
            locale: false,
            label: t('app.base.emailAddress'),
            labelPlacement: 'top',
            labelAlign: 'left',
            rule: [
              {
                key: 'identifier',
                type: 'string',
                trigger: ['input', 'change'],
                validator: (_rule: any, value: string) => {
                  if (!isEmailAddress(value))
                    return Promise.reject(t('app.base.emailAddress.rule'))
                  return Promise.resolve()
                },
              },
            ],
          },
          componentProp: {
            key: 'email',
            clearable: true,
          },
          transitionProp: {
            transitionName: 'fade-up-big',
            duration: 500,
          },
        } as WForm.Schema.Item<typeof formData.value>,
  ]

  return baseSchemas
})

const [register, { validate, restoreValidation }] = useForm<typeof formData.value>({
  baseRules: true,
  schemas: schemas.value,
})

defineExpose({
  validate,
  restoreValidation,
  getIdentifier: () => formData.value.identifier,
})
</script>

<template>
  <div>
    <!-- @vue-generic {typeof formData.value} -->
    <WForm :model="formData" :schemas="schemas" @hook="register" />
  </div>
</template>
