<script lang="ts" setup>
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser'
import type { InputInst } from 'naive-ui'
import { startAuthentication } from '@simplewebauthn/browser'
import { authMfaStatusAPI, authMfaTotpVerifyAPI, authMfaWebauthnAuthenticateOptionsAPI, authMfaWebauthnAuthenticateVerifyAPI } from '@/api/auth/mfa'

defineOptions({
  name: 'MfaVerify',
})

interface MfaMethod {
  key: string
  name: string | ComputedRef<string>
  description: string | ComputedRef<string>
  icon: string
  enabled?: boolean
}

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()

const nInputRef = useTemplateRef<InputInst>('nInputRef')

const currentStep = ref(1)
const loading = ref(false)
const selectedMethod = ref<string>('')
const verifyCode = ref('')
const errorMessage = ref('')
const authenticationOptions = ref<PublicKeyCredentialRequestOptionsJSON>()
const trusted = ref(false)

const mfaMethods = ref<MfaMethod[]>([
  {
    key: 'totp',
    name: computed(() => t('mfa.totp')),
    description: computed(() => t('mfa.totp.desc')),
    icon: 'simple-icons:google',
    enabled: false,
  },
  {
    key: 'webauthn',
    name: computed(() => t('mfa.webauthn')),
    description: computed(() => t('mfa.webauthn.desc')),
    icon: 'simple-icons:webauthn',
    enabled: false,
  },
])

const canVerify = computed(() => verifyCode.value.length === 6)

async function onInit() {
  try {
    loading.value = true
    const res = await authMfaStatusAPI()
    mfaMethods.value = mfaMethods.value.map((method) => {
      const target = res.find(item => item.type === method.key)
      method.enabled = target?.enabled || false
      return method
    })
  }
  finally {
    loading.value = false
  }
}

function selectMethod(methodKey: string) {
  const method = mfaMethods.value.find(m => m.key === methodKey && m.enabled)
  if (!method)
    return

  selectedMethod.value = methodKey
  currentStep.value = 2
  errorMessage.value = ''

  if (methodKey === 'totp') {
    nextTick(() => {
      nInputRef.value?.focus()
    })
  }
  else if (methodKey === 'webauthn') {
    performWebAuthnVerification()
  }
}

async function verifyTotp() {
  if (!canVerify.value)
    return

  try {
    loading.value = true
    errorMessage.value = ''

    const accessToken = await authMfaTotpVerifyAPI({
      trusted: trusted.value,
      code: verifyCode.value,
    })

    await userStoreAuth.ExecuteCoreFnAfterAuth(accessToken)
  }
  finally {
    loading.value = false
  }
}

async function performWebAuthnVerification() {
  try {
    loading.value = true
    errorMessage.value = ''

    const res = await authMfaWebauthnAuthenticateOptionsAPI()
    authenticationOptions.value = res.options

    await nextTick()

    const authResponse = await startAuthentication({
      optionsJSON: authenticationOptions.value!,
    })

    const accessToken = await authMfaWebauthnAuthenticateVerifyAPI({
      response: authResponse,
      trusted: trusted.value,
    })

    userStoreAuth.ExecuteCoreFnAfterAuth(accessToken)
  }
  catch (error: any) {
    console.error('WebAuthn verification failed:', error)
    errorMessage.value = getWebAuthnErrorMessage(error)
    currentStep.value = 1
    selectedMethod.value = ''
  }
  finally {
    loading.value = false
  }
}

function getWebAuthnErrorMessage(error: any): string {
  const errorName = error?.name || ''
  const errorMessage = error?.message || ''

  switch (errorName) {
    case 'NotAllowedError':
      return '操作被取消或超时，请重试'
    case 'InvalidStateError':
      return '验证器状态无效，请重试'
    case 'NotSupportedError':
      return '您的浏览器不支持此类型的验证器'
    case 'SecurityError':
      return '操作不安全，请使用 HTTPS 连接'
    case 'AbortError':
      return '操作被中止，请重试'
    case 'TimeoutError':
      return '操作超时，请重试'
    case 'NetworkError':
      return '网络错误，请检查连接'
    default:
      return errorMessage || '验证失败，请重试'
  }
}

function goBackToMethodSelection() {
  currentStep.value = 1
  selectedMethod.value = ''
  verifyCode.value = ''
  errorMessage.value = ''
}

onBeforeMount(async () => {
  await onInit()
})
</script>

<template>
  <div class="min-h-screen w-screen flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <div class="mb-8 text-center">
        <div class="mb-4 h-20 w-20 inline-flex items-center justify-center rounded-full bg-info text-white">
          <WIcon icon="carbon-security" height="32" />
        </div>
        <h1 class="mb-2 text-3xl font-bold">
          {{ $t('mfa.verify.title1') }}
        </h1>
        <p class="text-base">
          {{ $t('mfa.verify.title2') }}
        </p>
      </div>

      <NSteps :current="currentStep" class="mb-8 ml-52" content-placement="bottom">
        <NStep :title="$t('mfa.verify.step1.title')" />
        <NStep :title="$t('mfa.verify.step2.title')" />
      </NSteps>

      <div v-if="loading && currentStep === 1" class="flex justify-center py-12">
        <NSpin size="large" />
      </div>

      <template v-else-if="currentStep === 1">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NCard
            v-for="method in mfaMethods.filter(m => m.enabled)"
            :key="method.key"
            :bordered="true"
            class="cursor-pointer transition-all duration-300 hover:shadow-lg"
            @click="selectMethod(method.key)"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 flex items-center justify-center rounded-lg from-blue-500 to-indigo-600 bg-gradient-to-br">
                  <WIcon :icon="method.icon" height="24" class="text-white" />
                </div>
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="mb-1 text-lg font-semibold">
                  {{ method.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ method.description }}
                </p>
              </div>
            </div>
          </NCard>
        </div>

        <n-checkbox v-model:checked="trusted" :disabled="loading" class="mt-4 w-full flex items-center justify-center">
          {{ $t('mfa.trusted') }}
        </n-checkbox>
      </template>

      <div v-else-if="currentStep === 2 && selectedMethod === 'totp'" class="mx-auto max-w-md">
        <div class="text-center">
          <h3 class="mb-4 text-lg font-semibold">
            {{ $t('app.base.verifyCode.input') }}
          </h3>

          <p class="mb-6 text-sm text-gray-500">
            {{ $t('mfa.totp.verify.title1') }}
          </p>

          <div class="mb-6">
            <NInput
              ref="nInputRef"
              v-model:value="verifyCode"
              placeholder="000000"
              size="large"
              maxlength="6"
              :allow-input="(value: string) => /^\d*$/.test(value)"
              class="text-center text-2xl tracking-widest font-mono"
              @keyup.enter="verifyTotp"
            >
              <template #prefix>
                <WIcon icon="carbon-password" />
              </template>
            </NInput>
          </div>

          <NAlert v-if="errorMessage" type="error" class="mb-4">
            {{ errorMessage }}
          </NAlert>

          <NSpace justify="center">
            <NButton :disabled="loading" @click="goBackToMethodSelection">
              {{ $t('app.base.back') }}
            </NButton>
            <NButton
              type="primary"
              :disabled="!canVerify"
              :loading="loading"
              @click="verifyTotp"
            >
              {{ $t('app.base.verify') }}
            </NButton>
          </NSpace>
        </div>
      </div>

      <div v-else-if="currentStep === 2 && selectedMethod === 'webauthn'" class="mx-auto max-w-md">
        <div class="py-8 text-center">
          <NSpin size="large" class="mb-6" />

          <h3 class="mb-4 text-lg font-semibold">
            {{ $t('mfa.webauthn.step2.title') }}
          </h3>

          <p class="mb-4 text-gray-500">
            {{ $t('mfa.webauthn.step2.desc') }}
          </p>

          <NAlert type="warning">
            <div class="text-sm">
              <p class="mb-2 font-medium">
                {{ $t('mfa.webauthn.step2.action') }}
              </p>
              <ul class="ml-4 list-disc text-left space-y-1">
                <li>{{ $t('mfa.webauthn.step2.action1') }}</li>
                <li>{{ $t('mfa.webauthn.step2.action2') }}</li>
              </ul>
            </div>
          </NAlert>

          <NAlert v-if="errorMessage" type="error" class="mt-4">
            {{ errorMessage }}
          </NAlert>

          <NButton class="mt-6" :disabled="loading" :loading="loading" @click="goBackToMethodSelection">
            {{ $t('app.base.cancel') }}
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>
