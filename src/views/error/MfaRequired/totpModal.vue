<script lang="ts" setup>
import type { InputInst } from 'naive-ui'
import type { IResponseData } from '@/api/response'
import { name } from '~build/package'
import { authMfaTotpBindAPI, authMfaTotpGenerateAPI, authMfaTotpUnbindAPI } from '@/api/auth/mfa'
import { downloadByBlob } from '@/utils/file/download'

defineOptions({
  name: 'Name',
  inheritAttrs: true,
})

const emits = defineEmits<{ success: [] }>()

const { t } = useAppI18n()
const appStoreFingerprint = useAppStoreFingerprint()

const nInputRef = useTemplateRef<InputInst>('nInputRef')

const show = ref(false)
const currentStep = ref(1)
const loading = ref(false)

const totpData = ref<IResponseData.Auth.MFA.TotpGenerate>()
const verifyCode = ref('')
const backupCodes = ref<string[]>([])

const canVerify = computed(() => verifyCode.value.length === 6)

// start generate totpy
async function onBind() {
  try {
    loading.value = true
    const res = await authMfaTotpGenerateAPI({
      name: appStoreFingerprint.getDeviceNameFromFingerprint,
    })
    totpData.value = res
    currentStep.value = 1
    show.value = true
  }
  finally {
    loading.value = false
  }
}

// verify and bind totp
async function bindTotp() {
  if (!canVerify.value || !totpData.value)
    return

  try {
    loading.value = true
    const res = await authMfaTotpBindAPI({
      name: appStoreFingerprint.getDeviceNameFromFingerprint,
      code: verifyCode.value,
      tempTotpId: totpData.value.totpId,
    })

    backupCodes.value = res.backupCodes || []
    currentStep.value = 3

    emits('success')
  }
  finally {
    loading.value = false
  }
}

// unbind totp
async function onUnbind() {
  const { confirmed } = await useAppConfirm('解绑后，您将无法使用双因素认证。建议先确保有其他登录方式。确定要继续吗？', {
    title: '确认解绑',
  })

  if (confirmed) {
    try {
      loading.value = true
      await authMfaTotpUnbindAPI()
      emits('success')
    }
    finally {
      loading.value = false
    }
  }
}

// close bind modal
function closeBindModal() {
  show.value = false
  currentStep.value = 1
  totpData.value = undefined
  verifyCode.value = ''
  backupCodes.value = []
}

// go to step 2
function onGoStep2() {
  currentStep.value = 2
  nextTick(() => {
    nInputRef.value?.focus()
  })
}

// 下载备用码
function downloadBackupCodes() {
  const content = `${name} - ${t('mfa.totp.backupCodes')}\n${t('app.base.createdAt')}: ${new Date().toLocaleString()}\n\n${backupCodes.value.join('\n')}\n\n${t('mfa.totp.backupCodes.title1')} - ${t('mfa.totp.backupCodes.title3')}`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  downloadByBlob(blob, `totp-backup-codes-${Date.now()}.txt`)
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
    :title="$t('mfa.totp.title')"
    :style="{ width: '600px' }"
    :closable="currentStep !== 3"
    :mask-closable="false"
    @close="closeBindModal"
  >
    <!-- step -->
    <NSteps :current="currentStep" class="mb-8 ml-20" content-placement="bottom">
      <NStep :title="$t('comp.qrcode.scan')" />
      <NStep :title="$t('app.base.verify')" />
      <NStep :title="$t('app.base.done')" />
    </NSteps>

    <!-- step 1: scan qrcode -->
    <div v-if="currentStep === 1 && totpData" class="text-center">
      <h3 class="mb-4 text-lg font-semibold">
        {{ $t('mfa.totp.scan') }}
      </h3>

      <!-- qrcode -->
      <div class="mb-4 inline-block rounded-lg bg-white p-4 shadow-sm">
        <img :src="totpData.qrCode" alt="TOTP QR Code" class="h-64 w-64">
      </div>

      <p class="mb-4 text-sm text-gray-600">
        {{ $t('app.base.account') }}: <span class="font-medium font-mono">{{ totpData.account }}</span>
      </p>

      <!-- manual input option -->
      <details class="text-left">
        <summary class="mb-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700">
          {{ $t('mfa.totp.manual') }}
        </summary>
        <NAlert type="info" class="mt-2">
          <div class="text-sm">
            <p class="mb-2">
              {{ $t('mfa.totp.manual.key') }}
            </p>
            <div class="flex items-center justify-between rounded bg-gray-100 px-3 py-2 font-mono">
              <span class="break-all">{{ totpData.secret }}</span>
              <WCopy
                :source="totpData.secret"
              />
            </div>
          </div>
        </NAlert>
      </details>

      <NSpace justify="center" class="mt-6">
        <NButton @click="closeBindModal">
          {{ $t('app.base.no') }}
        </NButton>
        <NButton type="primary" @click="onGoStep2">
          {{ $t('app.base.next') }}
        </NButton>
      </NSpace>
    </div>

    <!-- Step2: verify -->
    <div v-if="currentStep === 2" class="text-center">
      <h3 class="mb-4 text-lg font-semibold">
        {{ $t('mfa.totp.verify.title1') }}
      </h3>

      <p class="mb-6 text-sm text-gray-600">
        {{ $t('mfa.totp.verify.title2') }}
      </p>

      <div class="mx-auto mb-6 max-w-xs">
        <NInput
          ref="nInputRef"
          v-model:value="verifyCode"
          placeholder="000000"
          size="large"
          maxlength="6"
          :allow-input="(value: string) => /^\d*$/.test(value)"
          class="text-center text-2xl tracking-widest font-mono"
          @keyup.enter="bindTotp"
        >
          <template #prefix>
            <WIcon icon="carbon-password" />
          </template>
        </NInput>
      </div>

      <NSpace justify="center">
        <NButton @click="currentStep = 1">
          {{ $t('app.base.prev') }}
        </NButton>
        <NButton
          type="primary"
          :disabled="!canVerify"
          :loading="loading"
          @click="bindTotp"
        >
          {{ $t('mfa.totp.verify.button') }}
        </NButton>
      </NSpace>
    </div>

    <!-- Step3: done -->
    <div v-if="currentStep === 3" class="text-center">
      <WIcon icon="carbon-checkmark-filled" class="mx-auto mb-4 text-6xl text-green-500" />
      <h3 class="mb-2 text-lg font-semibold">
        {{ $t('mfa.totp.done.title1') }}
      </h3>
      <p class="mb-6 text-gray-600">
        {{ $t('mfa.totp.done.title2') }}
      </p>

      <!-- backup codes -->
      <NAlert type="warning" class="mb-6 text-left">
        <template #header>
          <div class="flex items-center gap-2 font-medium">
            {{ $t('mfa.totp.backupCodes.title1') }}
          </div>
        </template>
        <div class="text-sm">
          <p class="mb-3">
            {{ $t('mfa.totp.backupCodes.title2') }}
            <strong class="text-orange-700">{{ $t('mfa.totp.backupCodes.title3') }}</strong>
          </p>
          <div class="mb-3 max-h-48 overflow-y-auto rounded bg-gray-50 p-3 text-xs font-mono">
            <div v-for="(code, index) in backupCodes" :key="index" class="mb-1">
              {{ index + 1 }}. {{ code }}
            </div>
          </div>
          <NSpace>
            <WCopy :source="backupCodes.join('\n')" />
            <NButton size="tiny" dashed type="info" @click="downloadBackupCodes">
              <template #icon />
              {{ $t('app.base.download') }}
            </NButton>
          </NSpace>
        </div>
      </NAlert>

      <NButton type="primary" block @click="closeBindModal">
        {{ $t('app.base.done') }}
      </NButton>
    </div>
  </NModal>
</template>
