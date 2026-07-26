<script lang="ts" setup>
import type { VerifyAuthMethod, VerifyAuthMethodType, VerifyAuthOptions, VerifyAuthStep } from './types'
import { authMfaTotpVerifyAPI } from '@/api/auth/mfa'
import { bindUserIdentityAPI, checkUserIdentityAPI, verifyUserIdentityAPI } from '@/api/system/user_identity'
import IdentityInput from './components/IdentityInput.vue'
import MethodSelect from './components/MethodSelect.vue'
import VerifyCode from './components/VerifyCode.vue'

/**
 * Secondary Authentication Modal Component
 * Unified secondary authentication for sensitive operations
 * Supports SMS, Email, TOTP, and WebAuthn methods
 * Supports both verify mode (existing) and bind mode (first-time)
 *
 * Architecture:
 * - This component: Flow control and state management only
 * - MethodSelect: Step 1 - Select authentication method
 * - IdentityInput: Step 2 - Input phone/email (bind mode only)
 * - VerifyCode: Step 3 - Input verification code
 */

defineOptions({
  name: 'WCompBusinessVerifyAuth',
})

const compStoreVerifyAuth = useStoreCompVerifyAuth()

const options = computed(() => compStoreVerifyAuth.getOptions)

const { t } = useAppI18n()

// ============================================
// State Management
// ============================================
const currentStep = ref<VerifyAuthStep>('select')
const selectedMethod = ref<VerifyAuthMethod>()

/** Component refs */
const identityInputRef = useTemplateRef('identityInputRef')

// ============================================
// Options with defaults
// ============================================

const localOptions = computed<Required<VerifyAuthOptions>>(() => ({
  mode: 'verify',
  preSelectedMethod: undefined as unknown as VerifyAuthMethodType,
  allowedMethods: undefined as unknown as VerifyAuthMethodType[],
  showTrusted: true,
  purpose: 'security',
  showSetAsSecurity: false,
  ...options.value,
}))

const getIsBindMode = computed(() => localOptions.value.mode === 'bind')
const getIsSms = computed(() => selectedMethod.value?.type === 'sms')

// ============================================
// Methods
// ============================================

/**
 * Handle method selection from MethodSelect component
 */
function onMethodSelect(method: VerifyAuthMethod) {
  console.log(123, method)

  selectedMethod.value = method

  // Determine next step based on mode and method
  if (getIsBindMode.value && (method.type === 'sms' || method.type === 'email')) {
    // Bind mode with SMS/Email: show input form first
    currentStep.value = 'input'
  }
  else {
    // Verify mode or TOTP: go directly to verification
    currentStep.value = 'verify'
  }
}

/**
 * Handle verification code submit from VerifyCode component
 */
async function onVerifyCode(code: string) {
  if (!selectedMethod.value)
    return

  const { mode, purpose } = localOptions.value
  const method = selectedMethod.value

  try {
    if (mode === 'bind' && (method.type === 'sms' || method.type === 'email')) {
      // Bind mode: bind then verify
      await bindUserIdentityAPI({
        type: method.type === 'sms' ? 'phoneNumber' : 'emailAddress',
        purpose,
        identifier: identityInputRef.value?.getIdentifier() as string,
        setAsSecurity: false,
        verifyCode: code,
      })
      compStoreVerifyAuth.onCloseVerifyAuthModal()
    }
    else if (method.type === 'sms' || method.type === 'email') {
      // Verify mode: just verify
      await verifyUserIdentityAPI({
        type: method.type === 'sms' ? 'phoneNumber' : 'emailAddress',
        purpose,
        verifyCode: code,
      })
      compStoreVerifyAuth.onCloseVerifyAuthModal()
    }
    else if (method.type === 'totp') {
      await authMfaTotpVerifyAPI({
        code,
        trusted: false,
      })
      compStoreVerifyAuth.onCloseVerifyAuthModal()
    }

    // Close modal and reset
    resetState()
  }
  catch (_error) {
    console.error(_error)
    // Error is handled by API interceptor
    // Stay on verify step for user to retry
  }
}

/**
 * Handle back button
 */
function onBack() {
  if (getIsBindMode.value) {
    if (currentStep.value === 'input') {
      currentStep.value = 'select'
      selectedMethod.value = undefined
    }
    else {
      currentStep.value = 'input'
    }
  }
  else {
    // In verify mode, go back to selection
    currentStep.value = 'select'
    selectedMethod.value = undefined
  }
}

/**
 * Reset all state
 */
function resetState() {
  selectedMethod.value = undefined
}

// ============================================
// Modal
// ============================================
const getModalTitle = computed(() => {
  if (currentStep.value === 'select') {
    return getIsBindMode.value
      ? t('security.bind.title1')
      : t('security.verify.title1')
  }
  else if (currentStep.value === 'input') {
    return t(getIsSms.value ? 'security.phone.modalTitle' : 'security.email.modalTitle')
  }
  else if (currentStep.value === 'verify') {
    return t('security.title3')
  }
  return ''
})
const loading = ref(true)
const getModalCanClose = computed(() => {
  // Only allow closing on method select step
  return currentStep.value === 'select'
})

async function onCheckInput() {
  if (currentStep.value === 'input' && identityInputRef.value) {
    const isValid = await identityInputRef.value.validate()
    if (!isValid)
      return
    identityInputRef.value.restoreValidation()
    loading.value = true
    try {
      await checkUserIdentityAPI({
        type: getIsSms.value ? 'phoneNumber' : 'emailAddress',
        purpose: localOptions.value.purpose,
        identifier: identityInputRef.value.getIdentifier()!,
      })
      currentStep.value = 'verify'
    }
    finally {
      loading.value = false
    }
  }
}

provide('loading', loading)
provide('selectedMethod', selectedMethod)
</script>

<template>
  <WModal
    v-model:show="compStoreVerifyAuth.show"
    :title="getModalTitle"
    :default-button="false"
    width="480px"
    :fullscreen="false"
    :loading="loading"
    :closable="getModalCanClose"
    :mask-closable="getModalCanClose"
    :close-on-esc="getModalCanClose"
  >
    <template #default>
      <WTransition appear transition-name="slide-left" :duration="300">
        <!-- Step 1: Method Selection -->
        <MethodSelect
          v-show="currentStep === 'select'"
          :options="localOptions"
          @select="onMethodSelect"
        />
      </WTransition>

      <WTransition appear transition-name="slide-left" :duration="300">
        <!-- Step 2: Identity Input (Bind Mode Only) -->
        <IdentityInput
          v-show="currentStep === 'input'"
          ref="identityInputRef"
          key="input"
        />
      </WTransition>

      <WTransition appear transition-name="slide-left" :duration="300">
        <!-- Step 3: Verification Code -->
        <VerifyCode
          v-show="currentStep === 'verify'"
          key="verify"
          @verify="onVerifyCode"
        />
      </WTransition>
    </template>

    <template #action>
      <div v-if="currentStep === 'input'" class="w-full flex justify-end">
        <WButton size="small" class="me-2" @click="onBack">
          {{ t('app.base.back') }}
        </WButton>

        <WButton size="small" type="primary" @click="onCheckInput">
          {{ t('app.base.yes') }}
        </WButton>
      </div>

      <div v-else-if="currentStep === 'verify'" class="w-full flex justify-end">
        <WButton size="small" class="me-2" @click="onBack">
          {{ t('app.base.back') }}
        </WButton>

        <WButton size="small" type="primary">
          {{ t('app.base.verify') }}
        </WButton>
      </div>
    </template>
  </WModal>
</template>
