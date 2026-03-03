<script lang="ts" setup>
import type { VerifyAuthMethodType, VerifyAuthOptions } from '../types'
import type { IModels } from '@/api/models'
import type { ICompExtraPhoneNumberInputUpdateParams } from '@/components/Extra/PhoneNumberInput'
import type { WForm } from '@/components/UI/Form'
import { checkUserIdentityAPI } from '@/api/system/user_identity'
import { isEmailAddress, isPhoneNumber } from '@/utils/regex'

/**
 * Step 2: Identity Input (Bind Mode)
 * Input phone number or email address for first-time binding
 * Uses WForm with schemas - consistent with otp.vue pattern
 */

defineOptions({
  name: 'WCompBusinessVerifyAuthIdentityInput',
})

const props = defineProps<{
  /** Input type - 'sms' for phone, 'email' for email */
  type: VerifyAuthMethodType
  /** Component options */
  options: Required<VerifyAuthOptions>
}>()

const emit = defineEmits<{
  /** Identity checked and code sent */
  (e: 'confirm', identifier: string, setAsSecurity: boolean): void
  /** Cancelled / go back */
  (e: 'cancel'): void
}>()

const { t } = useAppI18n()

// Form data - using useState pattern from otp.vue
const { stateRef: formData, resetState: resetFormData } = useState({
  identifier: null as string | null,
  setAsSecurity: false,
})

// Country calling code for phone validation
const countryCallingCode = ref('')

/**
 * Get identity type for API call
 */
const identityType = computed((): IModels.ISystemUserIdentityType => {
  return props.type === 'sms' ? 'phoneNumber' : 'emailAddress'
})

/**
 * Check if show setAsSecurity slot
 */
const _showSetAsSecuritySlot = computed(() => props.options.showSetAsSecurity)

/**
 * Get form schemas based on type
 */
const schemas = computed<WForm.Schema.Item<typeof formData.value>[]>(() => {
  const isPhone = props.type === 'sms'

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
            clearable: true,
          },
          transitionProp: {
            transitionName: 'fade-up-big',
            duration: 500,
          },
        } as WForm.Schema.Item<typeof formData.value>,
  ]

  // Add setAsSecurity slot schema when showSetAsSecurity is true
  if (props.options.showSetAsSecurity) {
    baseSchemas.push({
      type: 'Base:Slot',
      formProp: {
        path: 'setAsSecurity',
        showLabel: false,
      },
    })
  }

  return baseSchemas
})

const [register, { onOpen, onClose: closeModal }] = useForm<typeof formData.value>({
  dialogPreset: 'modal',
  baseRules: true,
  dialogProps: {
    width: '30%',
    closable: true,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    fullscreen: false,
    title: computed(() => t(props.type === 'sms' ? 'security.phone.modalTitle' : 'security.email.modalTitle')),
    onYes: async (_onApiHandler, _modalYesDone) => {
      await onConfirm()
    },
    onNo: (close) => {
      close()
      onCancel()
    },
  },
  schemas: schemas.value,
})

/**
 * Check identity and proceed to verification
 */
async function onConfirm() {
  await checkUserIdentityAPI({
    type: identityType.value,
    purpose: props.options.purpose,
    identifier: formData.value.identifier!,
  })

  closeModal()
  emit('confirm', formData.value.identifier!, formData.value.setAsSecurity)
}

/**
 * Handle cancel / go back
 */
function onCancel() {
  resetFormData()
  emit('cancel')
}

// Watch show prop to open/close modal and reset state
onMounted(() => {
  resetFormData()
  onOpen()
})
</script>

<template>
  <WForm :model="formData" :schemas="schemas" @hook="register">
    <template v-if="options.showSetAsSecurity" #setAsSecurity>
      <n-alert class="w-full" type="info" :show-icon="false">
        <template #header>
          <n-checkbox v-model:checked="formData.setAsSecurity">
            {{ $t(type === 'sms' ? 'security.phone.bindTitle' : 'security.email.bindTitle') }}
          </n-checkbox>
        </template>
        {{ $t(type === 'sms' ? 'security.phone.bindTip' : 'security.email.bindTip') }}
      </n-alert>
    </template>
  </WForm>
</template>
