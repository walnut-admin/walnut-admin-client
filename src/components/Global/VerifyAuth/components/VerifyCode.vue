<script lang="ts" setup>
import type { VerifyAuthMethod } from '../types'

/**
 * Step 3: Verification Code Input
 * Handles SMS, Email, and TOTP verification code input
 * Uses WForm with Raw:InputOtp - consistent with otp.vue pattern
 */

defineOptions({
  name: 'WCompBusinessVerifyAuthVerifyCode',
})

const emit = defineEmits<{
  (e: 'verify', code: string): void
}>()

const selectedMethod = inject<Ref<VerifyAuthMethod>>('selectedMethod')!

// Form data - using useState pattern from otp.vue
const { stateRef: formData } = useState({
  verifyCode: [] as string[],
  description: null,
})

const [register] = useForm<typeof formData.value>({
  baseRules: true,
  schemas: [
    {
      type: 'Base:Slot',
      formProp: {
        path: 'description',
        showLabel: false,
      },
      visibleProp: {
        vIf: computed(() => !!selectedMethod.value?.maskedValue),
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
</script>

<template>
  <div>
    <!-- @vue-generic {typeof formData.value} -->
    <WForm :model="formData" @hook="register">
      <template #description>
        <div class="mb-4 text-center text-sm text-gray-500">
          {{ selectedMethod.maskedValue }}
        </div>
      </template>
    </WForm>
  </div>
</template>
