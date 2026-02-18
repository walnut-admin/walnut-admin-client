<script lang="ts" setup>
import type { IModels } from '@/api/models'
import type { ICompExtraPhoneNumberInputUpdateParams } from '@/components/Extra/PhoneNumberInput'
import { bindUserIdentityAPI, checkUserIdentityAPI, verifyUserIdentityAPI } from '@/api/system/user_identity'
import { isEmailAddress, isPhoneNumber } from '@/utils/regex'

defineOptions({
  name: 'WMeTabSecurityTab1OTP',
  defaultView: false,
})

const emits = defineEmits<{
  (e: 'success'): void
}>()

const { t } = useAppI18n()

const actionType = ref<'bind' | 'verify'>('bind')
const type = ref<IModels.ISystemUserIdentityType>()
const securityBound = ref()
const countryCallingCode = ref()
const maskedValue = ref()
const loading = ref(false)

const { stateRef: formDataPhone, resetState: resetFormDataPhone } = useState({
  identifier: null,
  setAsSecurity: false,
})

const { stateRef: formDataEmail, resetState: resetFormDataEmail } = useState({
  identifier: null,
  setAsSecurity: false,
})

const { stateRef: formDataVerify, resetState: resetFormDataVerify } = useState({
  verifyCode: [],
})

function resetFormData() {
  resetFormDataPhone()
  resetFormDataEmail()
  resetFormDataVerify()
}

const [registerVerify, { onOpen: onOpenVerifyModal, onClose: onCloseVerifyModal }] = useForm<typeof formDataVerify.value>({
  dialogPreset: 'modal',
  baseRules: true,
  dialogProps: {
    width: '30%',
    closable: computed(() => actionType.value === 'bind'),
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    fullscreen: false,
    title: computed(() => t('app.base.verifyCode.input')),
    onYes: async (_onApiHandler, _modalYesDone) => {
      await onVerify()
    },
    onNo: (close) => {
      close()
    },
  },
  schemas: [
    {
      type: 'Raw:InputOtp',
      formProp: {
        path: 'verifyCode',
        labelPlacement: 'top',
        labelAlign: 'left',
      },
      componentProp: {
        block: true,
        onFinish: async () => {
          await onVerify()
        },
      },
    },
  ],
})

async function onVerify() {
  if (actionType.value === 'verify') {
    await verifyUserIdentityAPI({
      type: type.value!,
      purpose: 'login',
      verifyCode: formDataVerify.value.verifyCode!.join(''),
    })
  }
  else {
    await bindUserIdentityAPI({
      type: type.value!,
      purpose: 'login',
      identifier: type.value === 'phoneNumber' ? formDataPhone.value.identifier! : formDataEmail.value.identifier!,
      setAsSecurity: type.value === 'phoneNumber' ? formDataPhone.value.setAsSecurity : formDataEmail.value.setAsSecurity,
      verifyCode: formDataVerify.value.verifyCode!.join(''),
    })
  }
  useAppMsgSuccess()
  onCloseVerifyModal()
  emits('success')
  resetFormData()
}

const [registerPhone, { onOpen: onOpenPhoneModal, onClose: onClosePhoneModal }] = useForm<typeof formDataPhone.value>({
  dialogPreset: 'modal',
  dialogProps: {
    width: '30%',
    closable: true,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    fullscreen: false,
    title: computed(() => t('security.phone.modalTitle')),
    onYes: async (_, done) => {
      try {
        await checkUserIdentityAPI({
          type: 'phoneNumber',
          purpose: 'login',
          identifier: formDataPhone.value.identifier!,
        })
        onClosePhoneModal()
        onOpenVerifyModal()
      }
      finally {
        done()
      }
    },
    onNo: (close) => {
      close()
    },
  },

  baseRules: true,

  disabled: computed(() => loading.value),
  schemas: [
    {
      type: 'Extra:PhoneNumberInput',
      formProp: {
        path: 'identifier',
        locale: false,
        first: true,
        label: computed(() => t('app.base.phoneNumber')),
        labelPlacement: 'top',
        labelAlign: 'left',
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
      type: 'Base:Slot',
      formProp: {
        path: 'setAsSecurity',
        rule: false,
        required: false,
        labelPlacement: 'top',
        labelAlign: 'left',
        showRequireMark: false,
        showLabel: false,
        showFeedback: false,
      },
    },
  ],
})

const [registerEmail, { onOpen: onOpenEmailModal, onClose: onCloseEmailModal }] = useForm<typeof formDataEmail.value>({
  dialogPreset: 'modal',
  dialogProps: {
    width: '30%',
    closable: true,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    fullscreen: false,
    title: computed(() => t('security.email.modalTitle')),
    onYes: async (_, done) => {
      try {
        await checkUserIdentityAPI({
          type: 'emailAddress',
          purpose: 'login',
          identifier: formDataEmail.value.identifier!,
        })
        onCloseEmailModal()
        onOpenVerifyModal()
      }
      finally {
        done()
      }
    },
    onNo: (close) => {
      close()
    },
  },

  baseRules: true,

  disabled: computed(() => loading.value),
  schemas: [
    {
      type: 'Extra:EmailInput',
      formProp: {
        path: 'identifier',
        ruleType: 'string',
        first: true,
        locale: false,
        label: computed(() => t('app.base.emailAddress')),
        labelPlacement: 'top',
        labelAlign: 'left',
        rule: [
          {
            key: 'identifier',
            type: 'string',
            trigger: ['input', 'change'],
            validator: (rule, value) => {
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
      type: 'Base:Slot',
      formProp: {
        path: 'setAsSecurity',
        rule: false,
        required: false,
        labelPlacement: 'top',
        labelAlign: 'left',
        showRequireMark: false,
        showLabel: false,
        showFeedback: false,
      },
    },
  ],
})

defineExpose({
  onOpen: (_type: IModels.ISystemUserIdentityType, bound: boolean, _maskedValue: string) => {
    type.value = _type
    securityBound.value = bound
    maskedValue.value = _maskedValue

    if (_type === 'phoneNumber') {
      onOpenPhoneModal()
    }
    else if (_type === 'emailAddress') {
      onOpenEmailModal()
    }
  },

  onOpenVerifyModal: (_type: IModels.ISystemUserIdentityType) => {
    type.value = _type
    actionType.value = 'verify'
    onOpenVerifyModal()
  },
})
</script>

<template>
  <!-- @vue-generic {typeof formDataPhone.value} -->
  <WForm :model="formDataPhone" @hook="registerPhone">
    <template #setAsSecurity>
      <n-alert class="w-full" type="info" :show-icon="false">
        <template #header>
          <n-checkbox v-model:checked="formDataPhone.setAsSecurity">
            {{ $t('security.phone.bindTitle') }}
          </n-checkbox>
        </template>
        <span v-if="securityBound">{{ $t('security.phone.bindDesc', { maskedValue }) }}, </span>{{ $t('security.phone.bindTip') }}
      </n-alert>
    </template>
  </WForm>

  <!-- @vue-generic {typeof formDataEmail.value} -->
  <WForm :model="formDataEmail" @hook="registerEmail">
    <template #setAsSecurity>
      <n-alert class="w-full" type="info" :show-icon="false">
        <template #header>
          <n-checkbox v-model:checked="formDataEmail.setAsSecurity">
            {{ $t('security.email.bindTitle') }}
          </n-checkbox>
        </template>
        <span v-if="securityBound">{{ $t('security.email.bindDesc', { maskedValue }) }}, </span>{{ $t('security.email.bindTip') }}
      </n-alert>
    </template>
  </WForm>

  <!-- @vue-generic {typeof formDataVerify.value} -->
  <WForm :model="formDataVerify" @hook="registerVerify" />
</template>
