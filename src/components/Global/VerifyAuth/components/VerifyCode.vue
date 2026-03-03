<script lang="ts" setup>
import type { VerifyAuthMethod, VerifyAuthOptions } from '../types'

/**
 * Step 3: Verification Code Input
 * Handles SMS, Email, and TOTP verification code input
 * Uses WForm with Raw:InputOtp - consistent with otp.vue pattern
 */

defineOptions({
  name: 'WCompBusinessVerifyAuthVerifyCode',
})

const props = defineProps<{
  /** Selected authentication method */
  method: VerifyAuthMethod
  /** Component options */
  options: Required<VerifyAuthOptions>
}>()

const emit = defineEmits<{
  /** Verification code submitted */
  (e: 'verify', code: string): void
  /** Go back to previous step */
  (e: 'back'): void
}>()

const { t } = useAppI18n()

// Form data - using useState pattern from otp.vue
const { stateRef: formData, resetState: resetFormData } = useState({
  verifyCode: [] as string[],
  description: null,
})

/**
 * Get modal title based on method
 */
const modalTitle = computed(() => {
  switch (props.method.type) {
    case 'sms':
      return t('security.phone.modalTitle')
    case 'email':
      return t('security.email.modalTitle')
    case 'totp':
      return t('mfa.totp.verify.title1')
    default:
      return t('app.base.verifyCode.input')
  }
})

/**
 * Get description text showing masked value
 */
const _descriptionText = computed(() => {
  if (props.method.maskedValue) {
    return props.method.maskedValue
  }
  return ''
})

const [register, { onOpen, onClose: closeModal }] = useForm<typeof formData.value>({
  dialogPreset: 'modal',
  baseRules: true,
  dialogProps: {
    width: '30%',
    closable: computed(() => props.options.mode === 'verify'),
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    fullscreen: false,
    title: modalTitle,
    onYes: async (_onApiHandler, _modalYesDone) => {
      await onVerify()
    },
    onNo: (close) => {
      close()
      onBack()
    },
  },
  schemas: [
    {
      type: 'Base:Slot',
      formProp: {
        path: 'description',
        showLabel: false,
      },
      visibleProp: {
        vIf: computed(() => !!props.method.maskedValue),
      },
    },
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

/**
 * Handle verification submit
 */
async function onVerify() {
  if (!formData.value.verifyCode?.length || formData.value.verifyCode.length < 6) {
    return
  }

  const code = formData.value.verifyCode.join('')
  emit('verify', code)
}

/**
 * Handle back button
 */
function onBack() {
  resetFormData()
  emit('back')
}

/**
 * Close modal and reset state
 */
function closeAndReset() {
  closeModal()
  resetFormData()
}

// Expose close method for parent
defineExpose({
  closeAndReset,
})

onMounted(() => {
  resetFormData()
  onOpen()
})
</script>

<template>
  <!-- @vue-generic {typeof formData.value} -->
  <WForm :model="formData" @hook="register">
    <template #description>
      <div class="mb-4 text-center text-sm text-gray-500">
        {{ method.maskedValue }}
      </div>
    </template>
  </WForm>
</template>
