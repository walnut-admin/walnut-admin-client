<script lang="ts" setup>
import type { VerifyAuthMethod, VerifyAuthOptions } from '../types'
import { useState } from '@walnut/core/hooks/core/useState'
import { authMfaStatusAPI } from '@/api/auth/mfa'
import { getSecurityTab1StatusAPI2 } from '@/api/system/user_identity'

/**
 * Step 1: Authentication Method Selection
 * Displays available authentication methods for user to choose
 * Uses WForm with dialogPreset: 'modal' - consistent with project patterns
 */

defineOptions({
  name: 'WCompBusinessVerifyAuthMethodSelect',
})

const props = defineProps<{
  /** Component options */
  options: Required<VerifyAuthOptions>
}>()

const emit = defineEmits<{
  /** Method selected */
  (e: 'select', method: VerifyAuthMethod): void
}>()

const { t } = useAppI18n()

const loading = inject<Ref<boolean>>('loading')!

const availableMethods = ref<VerifyAuthMethod[]>([])

/**
 * Filter enabled methods based on allowedMethods option
 */
const enabledMethods = computed(() => {
  if (!props.options.allowedMethods?.length) {
    return availableMethods.value.filter(m => m.enabled)
  }
  return availableMethods.value.filter(m =>
    m.enabled && props.options.allowedMethods!.includes(m.type),
  )
})

/**
 * Fetch available authentication methods from server
 */
async function onInit() {
  const { purpose, allowedMethods, mode } = props.options

  try {
    loading.value = true

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

    // Handle pre-selected method
    if (props.options.preSelectedMethod) {
      const method = availableMethods.value.find(m => m.type === props.options.preSelectedMethod)
      if (method) {
        onMethodClick(method)
      }
    }
  }
  finally {
    loading.value = false
  }
}

/**
 * Handle method card click
 */
function onMethodClick(method: VerifyAuthMethod) {
  emit('select', method)
}

const { stateRef: formData } = useState({
  methodSelectContent: null,
})

const [register] = useForm<typeof formData.value>({
  schemas: [
    {
      type: 'Base:Slot',
      formProp: {
        path: 'methodSelectContent',
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

onMounted(onInit)
</script>

<template>
  <div>
    <!-- @vue-generic {typeof formData.value} -->
    <WForm :model="formData" @hook="register">
      <template #methodSelectContent>
        <div class="w-full">
          <!-- Empty state -->
          <NEmpty
            v-if="enabledMethods.length === 0"
            :description="$t('mfa.empty')"
            class="py-8"
          />

          <!-- Methods list -->
          <div v-else class="space-y-3">
            <NCard
              v-for="method in enabledMethods"
              :key="method.type"
              :bordered="true"
              hoverable
              class="cursor-pointer transition-all duration-300 hover:shadow-md"
              @click="onMethodClick(method)"
            >
              <div class="flex items-center gap-4">
                <!-- Icon -->
                <div
                  class="h-12 w-12 flex flex-shrink-0 items-center justify-center rounded-lg from-blue-500 to-indigo-600 bg-gradient-to-br"
                >
                  <WIcon :icon="method.icon" height="24" class="text-white" />
                </div>

                <!-- Content -->
                <div class="min-w-0 flex-1">
                  <h3 class="text-base font-semibold">
                    {{ method.name }}
                  </h3>
                  <p v-if="method.maskedValue" class="truncate text-sm text-gray-500">
                    {{ method.maskedValue }}
                  </p>
                  <p v-else class="text-sm text-gray-500">
                    {{ method.description }}
                  </p>
                </div>

                <!-- Chevron -->
                <WIcon icon="mdi:chevron-right" class="text-gray-400" />
              </div>
            </NCard>
          </div>
        </div>
      </template>
    </WForm>
  </div>
</template>
