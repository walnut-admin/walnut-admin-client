<script lang="ts" setup>
import { authMfaStatusAPI, authMfaVerifyAPI } from '@/api/auth/mfa'
import { mainoutMfaRequiredRoute } from '@/router/routes/mainout'
import TotpModal from './totpModal.vue'
import WebauthnModal from './webauthnModal.vue'

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
const appStoreRoute = useAppStoreRoute()

const totpModalRef = useTemplateRef('totpModalRef')
const webauthnModalRef = useTemplateRef('webauthnModalRef')

const loading = ref(true)
const trusted = ref(false)

const mfaMethodsConfig = ref<MfaMethod[]>([
  {
    key: 'totp',
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
      webauthnModalRef.value?.onBind()
    },
    onUnbind: () => {
      webauthnModalRef.value?.onUnbind()
    },
  },
])

const getButtonCanClick = computed(() => mfaMethodsConfig.value.some(method => method.enabled))

async function onInit() {
  try {
    loading.value = true
    const res = await authMfaStatusAPI()
    mfaMethodsConfig.value = mfaMethodsConfig.value.map((i) => {
      const target = res.find(item => item.type === i.key)
      i.enabled = target?.enabled || false
      return i
    })
  }
  finally {
    loading.value = false
  }
}

// verify mfa
async function onVerifyMfa() {
  try {
    loading.value = true
    const accessToken = await authMfaVerifyAPI(trusted.value)
    await userStoreAuth.ExecuteCoreFnAfterAuth(accessToken)
    appStoreRoute.removeDynamicAuthRoute(mainoutMfaRequiredRoute)
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  await onInit()
})
</script>

<template>
  <div class="max-w-4xl min-w-[280px] w-full">
    <!-- header -->
    <div class="mb-8 text-center">
      <div class="mb-4 h-20 w-20 inline-flex items-center justify-center rounded-full bg-info text-white">
        <WIcon icon="carbon-security" height="32" />
      </div>
      <h1 class="mb-2 text-2xl font-bold sm:text-3xl">
        {{ $t('mfa.title1') }}
      </h1>
      <p class="text-sm sm:text-base">
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
    <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
          class="absolute right-2 top-2 text-xs sm:right-4 sm:top-4"
        >
          {{ $t('app.base.enabled') }}/{{ $t('app.base.recommended') }}
        </n-tag>

        <n-tag
          v-else-if="method.enabled"
          type="success"
          size="small"
          class="absolute right-2 top-2 sm:right-4 sm:top-4"
        >
          {{ $t('app.base.enabled') }}
        </n-tag>

        <n-tag
          v-else-if="method.recommended"
          type="info"
          size="small"
          class="absolute right-2 top-2 sm:right-4 sm:top-4"
        >
          {{ $t('app.base.recommended') }}
        </n-tag>

        <div class="flex items-start gap-3 sm:gap-4">
          <!-- icon -->
          <div class="flex-shrink-0">
            <div class="h-10 w-10 flex items-center justify-center rounded-lg from-blue-500 to-indigo-600 bg-gradient-to-br sm:h-12 sm:w-12">
              <WIcon :icon="method.icon" :height="20" class="text-white sm:h-6" />
            </div>
          </div>

          <!-- content -->
          <div class="min-w-0 flex-1 overflow-hidden">
            <h3 class="mb-1 break-words text-base font-semibold sm:text-lg">
              {{ method.name }}
            </h3>
            <p class="mb-3 break-words text-xs sm:mb-4 sm:text-sm">
              {{ method.description }}
            </p>

            <WButton
              :type="method.enabled ? 'warning' : 'info'"
              size="small"
              class="w-full sm:w-auto"
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
    <n-alert type="warning" class="mt-6 overflow-hidden border border-amber-200 rounded-lg sm:mt-8" :title="$t('mfa.tip1')">
      <div class="break-words text-xs sm:text-sm">
        {{ $t('mfa.tip2') }}
      </div>
    </n-alert>

    <div class="mx-auto mt-4 flex flex-col items-center justify-center gap-y-4 sm:mt-6">
      <n-checkbox v-model:checked="trusted" :disabled="loading">
        <span class="text-sm sm:text-base">{{ $t('mfa.trusted') }}</span>
      </n-checkbox>

      <WButton
        type="success"
        class="w-32 tracking-widest"
        :disabled="!getButtonCanClick || loading"
        round
        @click="onVerifyMfa"
      >
        {{ $t('app.base.verify') }}
      </WButton>
    </div>

    <!-- totp modal -->
    <TotpModal ref="totpModalRef" @success="onInit" />
    <!-- webauthn modal -->
    <WebauthnModal ref="webauthnModalRef" @success="onInit" />
  </div>
</template>
