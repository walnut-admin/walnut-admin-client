<script lang="ts" setup>
import { authMfaAvailableMethodsAPI, authMfaTotopStatusAPI, authMfaVerifyAPI } from '@/api/auth/mfa'
import TotpModal from './totpModal.vue'

defineOptions({
  name: 'AppErrorMfaRequired',
})

interface MfaMethod {
  key: string
  name: string | ComputedRef<string>
  description: string | ComputedRef<string>
  icon: string
  recommended?: boolean
  enabled?: boolean
  onBind?: () => void
  onUnbind?: () => void
}

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()

const totpModalRef = useTemplateRef('totpModalRef')

const loading = ref(true)

const mfaMethodsConfig = ref<MfaMethod[]>([
  {
    key: 'authenticator',
    name: computed(() => t('mfa.totp')),
    description: computed(() => t('mfa.totp.desc')),
    icon: 'simple-icons:google',
    recommended: true,
    enabled: false,
    onBind: () => {
      totpModalRef.value?.onBind()
    },
    onUnbind: () => {
      totpModalRef.value?.onUnbind()
    },
  },
  {
    key: 'webauthn',
    name: computed(() => t('mfa.webauthn')),
    description: computed(() => t('mfa.webauthn.desc')),
    icon: 'simple-icons:webauthn',
    recommended: false,
    enabled: false,
    onBind: () => {
      useAppMsgInfo(t('app.base.wip'))
    },
    onUnbind: () => {
      useAppMsgInfo(t('app.base.wip'))
    },
  },
])

const getButtonCanClick = computed(() => mfaMethodsConfig.value.some(method => method.enabled))

async function onTotpSuccess() {
  await onGetTotpStatus()
}

async function onGetTotpStatus() {
  try {
    loading.value = true
    const totpStatus = await authMfaTotopStatusAPI()

    const target = mfaMethodsConfig.value.find(method => method.key === 'authenticator')
    if (target) {
      target.enabled = totpStatus.enabled
    }
  }
  finally {
    loading.value = false
  }
}

async function onInit() {
  try {
    loading.value = true
    const res = await authMfaAvailableMethodsAPI()
    mfaMethodsConfig.value = mfaMethodsConfig.value.filter(method => res.availableMethods.includes(method.key))
  }
  finally {
    loading.value = false
  }
}

// verify mfa
async function onVerifyMfa() {
  try {
    loading.value = true
    const accessToken = await authMfaVerifyAPI()
    userStoreAuth.ExecuteCoreFnAfterAuth(accessToken)
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  await onInit()
  await onGetTotpStatus()
})
</script>

<template>
  <div class="min-h-screen w-screen flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- header -->
      <div class="mb-8 text-center">
        <div class="mb-4 h-20 w-20 inline-flex items-center justify-center rounded-full bg-info text-white">
          <WIcon icon="carbon-security" height="32" />
        </div>
        <h1 class="mb-2 text-3xl font-bold">
          {{ $t('mfa.title1') }}
        </h1>
        <p class="text-base">
          {{ $t('mfa.title2') }}
        </p>
      </div>

      <!-- loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <n-spin size="large" />
      </div>

      <!-- empty state -->
      <n-empty
        v-else-if="mfaMethodsConfig.length === 0"
        :description="$t('mfa.empty')"
        class="py-12"
      />

      <!-- mfa methods list -->
      <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <n-card
          v-for="method in mfaMethodsConfig"
          :key="method.key"
          :bordered="true"
          class="relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
          :class="method.recommended ? 'ring-2 ring-blue-400' : ''"
          @click="() => method.enabled ? method.onUnbind!() : method.onBind!()"
        >
          <n-tag
            v-if="method.enabled && method.recommended"
            type="info"
            size="small"
            class="absolute right-4 top-4"
          >
            {{ $t('app.base.enabled') }}/{{ $t('app.base.recommended') }}
          </n-tag>

          <!-- enabled tag -->
          <n-tag
            v-else-if="method.enabled"
            type="success"
            size="small"
            class="absolute right-4 top-4"
          >
            {{ $t('app.base.enabled') }}
          </n-tag>

          <!-- recommended tag -->
          <n-tag
            v-else-if="method.recommended"
            type="info"
            size="small"
            class="absolute right-4 top-4"
          >
            {{ $t('app.base.recommended') }}
          </n-tag>

          <div class="flex items-start gap-4">
            <!-- icon -->
            <div class="flex-shrink-0">
              <div class="h-12 w-12 flex items-center justify-center rounded-lg from-blue-500 to-indigo-600 bg-gradient-to-br">
                <WIcon :icon="method.icon" height="24" class="text-white" />
              </div>
            </div>

            <!-- content -->
            <div class="min-w-0 flex-1">
              <h3 class="mb-1 text-lg font-semibold">
                {{ method.name }}
              </h3>
              <p class="mb-4 text-sm">
                {{ method.description }}
              </p>

              <WButton
                :type="method.enabled ? 'warning' : 'info'"
                size="small"
                class="w-full md:w-auto"
                icon="carbon-arrow-right"
                @click.self="() => method.enabled ? method.onUnbind!() : method.onBind!()"
              >
                {{ method.enabled ? $t('app.base.unbind') : $t('app.base.configThis') }}
              </WButton>
            </div>
          </div>
        </n-card>
      </div>

      <!-- footer note -->
      <n-alert type="warning" class="mt-8 border border-amber-200 rounded-lg" :title="$t('mfa.tip1')">
        <div class="text-sm">
          {{ $t('mfa.tip2') }}
        </div>
      </n-alert>

      <WButton type="success" class="mx-auto mt-4 w-32 flex items-center justify-center tracking-widest" :disabled="!getButtonCanClick || loading" round @click="onVerifyMfa">
        {{ $t('app.base.verify') }}
      </WButton>
    </div>

    <!-- totp modal -->
    <TotpModal ref="totpModalRef" @success="onTotpSuccess" />
  </div>
</template>
