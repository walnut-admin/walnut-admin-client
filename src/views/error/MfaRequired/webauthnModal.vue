<script lang="ts" setup>
import type {
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/browser'
import type { InputInst } from 'naive-ui'
import { startRegistration } from '@simplewebauthn/browser'
import {
  authMfaWebauthnRegisterOptionsAPI,
  authMfaWebauthnRegisterVerifyAPI,
} from '@/api/auth/mfa'
import { getWebAuthnErrorMessage } from './shared'

defineOptions({
  name: 'MfaWebauthnModal',
})

const emits = defineEmits<{ success: [] }>()

const appStoreFingerprint = useAppStoreFingerprint()
const { t } = useAppI18n()

const nInputRef = useTemplateRef<InputInst>('nInputRef')

const show = ref(false)
const currentStep = ref(1)
const loading = ref(false)

const deviceName = ref('')
const registrationOptions = ref<PublicKeyCredentialCreationOptionsJSON>()
const registeredDeviceName = ref('')
const errorMessage = ref('')

const canRegister = computed(() => deviceName.value.trim().length > 0)

// start bind webauthn
async function onBind() {
  deviceName.value = appStoreFingerprint.getDeviceNameFromFingerprint
  currentStep.value = 1
  errorMessage.value = ''
  show.value = true

  nextTick(() => {
    nInputRef.value?.focus()
  })
}

// Step 1 -> Step 2: start register
async function startRegister() {
  if (!canRegister.value)
    return

  try {
    loading.value = true
    errorMessage.value = ''

    // 1. get register options
    const res = await authMfaWebauthnRegisterOptionsAPI({
      name: deviceName.value.trim(),
    })

    registrationOptions.value = res.options
    currentStep.value = 2

    // 2. wait for UI update, then call browser API
    await nextTick()
    await performBrowserRegistration()
  }
  catch (error: any) {
    console.error(error)
    errorMessage.value = error.message
    currentStep.value = 1
  }
  finally {
    loading.value = false
  }
}

//  perform browser WebAuthn registration
async function performBrowserRegistration() {
  if (!registrationOptions.value)
    return

  try {
    loading.value = true

    // 2. call browser WebAuthn API
    // user need to interact with authenticator (touch security key, Face ID, Touch ID, etc.)
    const registrationResponse = await startRegistration({ optionsJSON: registrationOptions.value })

    // 3. send response to backend for verification
    await authMfaWebauthnRegisterVerifyAPI({
      name: deviceName.value.trim(),
      response: registrationResponse,
    })

    registeredDeviceName.value = deviceName.value.trim()
    currentStep.value = 3

    emits('success')
  }
  catch (error: any) {
    console.error(error)
    errorMessage.value = getWebAuthnErrorMessage(error)
    currentStep.value = 1
  }
  finally {
    loading.value = false
  }
}

// unbind WebAuthn
async function onUnbind() {
  // TODO webauthn的解绑 有些特殊 需要弹窗然后一个列表 能挨个解绑 然后弹窗有一个统一的验证按钮
  // TODO required和verified有很多重复代码 可以抽离
  useAppMsgWarning(t('app.base.wip'))
  // const { confirmed } = await useAppConfirm(
  //   '解绑后，您将无法使用此安全密钥进行双因素认证。建议先确保有其他登录方式。确定要继续吗？',
  //   {
  //     title: '确认解绑',
  //   },
  // )

  // if (confirmed) {
  //   try {
  //     loading.value = true
  //     // TODO: 解绑
  //     // await authMfaWebauthnUnbindAPI()
  //     emits('success')
  //   }
  //   finally {
  //     loading.value = false
  //   }
  // }
}

// close Modal
function onCloseModal() {
  show.value = false
  currentStep.value = 1
  deviceName.value = ''
  registrationOptions.value = undefined
  registeredDeviceName.value = ''
  errorMessage.value = ''
}

defineExpose({
  onBind,
  onUnbind,
})
</script>

<template>
  <NModal
    v-model:show="show"
    preset="card"
    :title="$t('mfa.webauthn')"
    :style="{ width: '600px' }"
    :closable="currentStep !== 2"
    :mask-closable="false"
    @close="onCloseModal"
  >
    <!-- steps -->
    <NSteps :current="currentStep" class="mb-8 ml-20" content-placement="bottom">
      <NStep :title="$t('auth.register.prepare')" />
      <NStep :title="$t('mfa.webauthn.step2.title')" />
      <NStep :title="$t('app.base.done')" />
    </NSteps>

    <!-- Step 1: prepare register - input device name -->
    <div v-if="currentStep === 1" class="text-center">
      <WIcon icon="carbon-security" class="mx-auto mb-4 text-6xl text-primary" />

      <h3 class="mb-4 text-lg font-semibold">
        {{ $t('auth.register.prepare') }}
      </h3>

      <p class="mb-6 text-sm text-gray-500">
        {{ $t('mfa.webauthn.step1.desc') }}
      </p>

      <!-- device name input -->
      <div class="mx-auto mb-6 max-w-md">
        <NInput
          ref="nInputRef"
          v-model:value="deviceName"
          :placeholder="$t('mfa.webauthn.deviceName.placeholder')"
          size="large"
          maxlength="50"
          show-count
          clearable
          @keyup.enter="startRegister"
        >
          <template #prefix>
            <WIcon icon="carbon-devices" />
          </template>
        </NInput>
      </div>

      <!-- supported devices info -->
      <NAlert type="info" class="mb-6 text-left">
        <template #header>
          <div class="flex items-center gap-2 font-medium">
            {{ $t('mfa.webauthn.supportedDevices') }}
          </div>
        </template>
        <div class="text-sm">
          <ul class="ml-4 list-disc space-y-1">
            <li>{{ $t('mfa.webauthn.device.securityKey') }}</li>
            <li>{{ $t('mfa.webauthn.device.platform') }}</li>
          </ul>
        </div>
      </NAlert>

      <!-- error message -->
      <NAlert v-if="errorMessage" type="error" class="mb-4">
        {{ errorMessage }}
      </NAlert>

      <NSpace justify="center">
        <NButton @click="onCloseModal">
          {{ $t('app.base.no') }}
        </NButton>
        <NButton
          type="primary"
          :disabled="!canRegister"
          :loading="loading"
          @click="startRegister"
        >
          {{ $t('auth.register.start') }}
        </NButton>
      </NSpace>
    </div>

    <!-- Step 2: verify - wait user interaction -->
    <div v-if="currentStep === 2" class="py-8 text-center">
      <NSpin size="large" class="mb-6" />

      <h3 class="mb-4 text-lg font-semibold">
        {{ $t('mfa.webauthn.step2.title') }}
      </h3>

      <p class="mb-4 text-gray-500">
        {{ $t('mfa.webauthn.step2.desc') }}
      </p>

      <!-- verify action tip -->
      <NAlert type="warning" class="mx-auto max-w-md">
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
    </div>

    <!-- Step 3: verify success -->
    <div v-if="currentStep === 3" class="text-center">
      <WIcon icon="carbon-checkmark-filled" class="text-success mx-auto mb-4 text-6xl" />

      <h3 class="mb-2 text-lg font-semibold">
        {{ $t('auth.register.success') }}
      </h3>

      <p class="mb-6 text-gray-500">
        {{ $t('mfa.webauthn.step3.desc') }}
      </p>

      <!-- registered device info -->
      <NAlert type="success" class="mb-6 text-left">
        <div class="text-sm">
          <p class="mb-2">
            <span class="font-medium">{{ $t('app.base.deviceName') }}:</span>
            <span class="ml-2">{{ registeredDeviceName }}</span>
          </p>
          <p class="text-gray-500">
            {{ $t('mfa.webauthn.step3.tip') }}
          </p>
        </div>
      </NAlert>

      <NButton type="primary" block @click="onCloseModal">
        {{ $t('app.base.done') }}
      </NButton>
    </div>
  </NModal>
</template>
