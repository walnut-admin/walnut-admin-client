<script lang="ts" setup>
import type { VerifyAuthMethod, VerifyAuthMethodType, VerifyAuthOptions, VerifyAuthResult, VerifyAuthStep } from './types'
import { authMfaStatusAPI, authMfaTotpVerifyAPI } from '@/api/auth/mfa'
import { bindUserIdentityAPI, getSecurityTab1StatusAPI2, verifyUserIdentityAPI } from '@/api/system/user_identity'
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

const emit = defineEmits<{
  (e: 'verified', result: VerifyAuthResult): void
  (e: 'bound', result: VerifyAuthResult): void
  (e: 'cancelled'): void
}>()

const compStoreVerifyAuth = useStoreCompVerifyAuth()

const options = computed(() => compStoreVerifyAuth.getOptions)

const { t } = useAppI18n()

// ============================================
// State Management
// ============================================

/** Current step in the flow */
const currentStep = ref<VerifyAuthStep>('select')

/** Selected authentication method */
const selectedMethod = ref<VerifyAuthMethod>()

/** Available authentication methods */
const availableMethods = ref<VerifyAuthMethod[]>([])

/** Loading state for fetching methods */
const loadingMethods = ref(false)

/** Stored identifier for bind mode */
const storedIdentifier = ref('')

/** Stored setAsSecurity flag for bind mode */
const storedSetAsSecurity = ref(false)

/** Component refs */
const verifyCodeRef = useTemplateRef('verifyCodeRef')

// ============================================
// Options with defaults
// ============================================

const localOptions = computed<Required<VerifyAuthOptions>>(() => ({
  title: 'app.security.tab2',
  description: 'mfa.verify.title2',
  mode: 'verify',
  preSelectedMethod: undefined as unknown as VerifyAuthMethodType,
  allowedMethods: undefined as unknown as VerifyAuthMethodType[],
  showTrusted: true,
  purpose: 'security',
  showSetAsSecurity: false,
  ...options.value,
}))

// ============================================
// Step visibility controls - v-model for child components
// ============================================

const showMethodSelect = computed({
  get: () => currentStep.value === 'select',
  set: (val: boolean) => {
    if (!val)
      currentStep.value = 'input'
  },
})

const showIdentityInput = computed({
  get: () => currentStep.value === 'input',
  set: (val: boolean) => {
    if (!val)
      currentStep.value = 'verify'
  },
})

const showVerifyCode = computed({
  get: () => currentStep.value === 'verify',
  set: (val: boolean) => {
    if (!val)
      currentStep.value = 'select'
  },
})

// ============================================
// Methods
// ============================================

/**
 * Initialize the modal - fetch available methods
 */
async function initialize() {
  currentStep.value = 'select'
  selectedMethod.value = undefined
  storedIdentifier.value = ''
  storedSetAsSecurity.value = false

  await fetchAvailableMethods()

  console.log(123, options.value, localOptions.value)

  // Handle pre-selected method
  if (localOptions.value.preSelectedMethod) {
    const method = availableMethods.value.find(m => m.type === localOptions.value.preSelectedMethod)
    if (method) {
      onMethodSelect(method)
    }
  }
}

/**
 * Fetch available authentication methods from server
 */
async function fetchAvailableMethods() {
  const { purpose, allowedMethods, mode } = localOptions.value

  try {
    loadingMethods.value = true

    // Fetch both identity status and MFA status in parallel
    const [identityStatus, mfaStatus] = await Promise.all([
      getSecurityTab1StatusAPI2(purpose),
      authMfaStatusAPI(),
    ])

    // Build available methods list
    const allMethods: VerifyAuthMethod[] = [
      {
        type: 'sms',
        name: t('app.security.phoneNumber'),
        description: t('security.phone.desc'),
        icon: 'mdi:cellphone-android',
        enabled: mode === 'bind'
          ? !(identityStatus.phoneNumber?.bound && identityStatus.phoneNumber?.verified)
          : !!(identityStatus.phoneNumber?.bound && identityStatus.phoneNumber?.verified),
        maskedValue: identityStatus.phoneNumber?.maskedValue,
        bound: !!(identityStatus.phoneNumber?.bound && identityStatus.phoneNumber?.verified),
      },
      {
        type: 'email',
        name: t('app.security.emailAddress'),
        description: t('security.email.desc'),
        icon: 'mdi:email',
        enabled: mode === 'bind'
          ? !(identityStatus.emailAddress?.bound && identityStatus.emailAddress?.verified)
          : !!(identityStatus.emailAddress?.bound && identityStatus.emailAddress?.verified),
        maskedValue: identityStatus.emailAddress?.maskedValue,
        bound: !!(identityStatus.emailAddress?.bound && identityStatus.emailAddress?.verified),
      },
      {
        type: 'totp',
        name: t('mfa.totp'),
        description: t('mfa.totp.desc'),
        icon: 'simple-icons:google',
        enabled: !!(mfaStatus.find(m => m.type === 'totp')?.enabled),
        bound: !!(mfaStatus.find(m => m.type === 'totp')?.enabled),
      },
      {
        type: 'webauthn',
        name: t('mfa.webauthn'),
        description: t('mfa.webauthn.desc'),
        icon: 'simple-icons:webauthn',
        enabled: !!(mfaStatus.find(m => m.type === 'webauthn')?.enabled),
        bound: !!(mfaStatus.find(m => m.type === 'webauthn')?.enabled),
      },
    ]

    // Filter by allowed methods if specified
    availableMethods.value = allowedMethods?.length
      ? allMethods.filter(m => allowedMethods.includes(m.type))
      : allMethods
  }
  finally {
    loadingMethods.value = false
  }
}

/**
 * Handle method selection from MethodSelect component
 */
function onMethodSelect(method: VerifyAuthMethod) {
  console.log(123, method)

  selectedMethod.value = method

  // Determine next step based on mode and method
  if (localOptions.value.mode === 'bind' && (method.type === 'sms' || method.type === 'email')) {
    // Bind mode with SMS/Email: show input form first
    currentStep.value = 'input'
  }
  else {
    // Verify mode or TOTP: go directly to verification
    currentStep.value = 'verify'
  }
}

/**
 * Handle identity confirmed from IdentityInput component
 */
function onIdentityConfirm(identifier: string, setAsSecurity: boolean) {
  storedIdentifier.value = identifier
  storedSetAsSecurity.value = setAsSecurity
  currentStep.value = 'verify'
}

/**
 * Handle identity input cancel / go back
 */
function onIdentityCancel() {
  currentStep.value = 'select'
  selectedMethod.value = undefined
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
        identifier: storedIdentifier.value,
        setAsSecurity: storedSetAsSecurity.value,
        verifyCode: code,
      })

      const result: VerifyAuthResult = {
        verified: true,
        method: method.type,
        trusted: false,
        setAsSecurity: storedSetAsSecurity.value,
      }

      emit('bound', result)
      emit('verified', result)
    }
    else if (method.type === 'sms' || method.type === 'email') {
      // Verify mode: just verify
      await verifyUserIdentityAPI({
        type: method.type === 'sms' ? 'phoneNumber' : 'emailAddress',
        purpose,
        verifyCode: code,
      })

      const result: VerifyAuthResult = {
        verified: true,
        method: method.type,
        trusted: false,
      }

      emit('verified', result)
    }
    else if (method.type === 'totp') {
      await authMfaTotpVerifyAPI({
        code,
        trusted: false,
      })

      const result: VerifyAuthResult = {
        verified: true,
        method: 'totp',
        trusted: false,
      }

      emit('verified', result)
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
 * Handle verify code go back
 */
function onVerifyCodeBack() {
  if (localOptions.value.mode === 'bind' && selectedMethod.value
    && (selectedMethod.value.type === 'sms' || selectedMethod.value.type === 'email')) {
    // In bind mode, go back to input
    currentStep.value = 'input'
  }
  else {
    // In verify mode, go back to selection
    currentStep.value = 'select'
    selectedMethod.value = undefined
  }
}

/**
 * Handle cancelled from any step
 */
function onCancelled() {
  emit('cancelled')
  resetState()
}

/**
 * Reset all state
 */
function resetState() {
  currentStep.value = 'select'
  selectedMethod.value = undefined
  storedIdentifier.value = ''
  storedSetAsSecurity.value = false
}

// ============================================
// Watchers
// ============================================

onMounted(async () => {
  await initialize()
})
</script>

<template>
  <div class="secondary-auth">
    <!-- Step 1: Method Selection -->
    <MethodSelect
      v-if="showMethodSelect"
      :methods="availableMethods"
      :loading="loadingMethods"
      :options="localOptions"
      @select="onMethodSelect"
      @cancel="onCancelled"
    />

    <!-- Step 2: Identity Input (Bind Mode Only) -->
    <IdentityInput
      v-if="showIdentityInput"
      :type="selectedMethod.type"
      :options="localOptions"
      @confirm="onIdentityConfirm"
      @cancel="onIdentityCancel"
    />

    <!-- Step 3: Verification Code -->
    <VerifyCode
      v-if="showVerifyCode"
      ref="verifyCodeRef"
      :method="selectedMethod"
      :options="localOptions"
      @verify="onVerifyCode"
      @back="onVerifyCodeBack"
    />
  </div>
</template>
