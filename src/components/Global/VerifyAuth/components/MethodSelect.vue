<script lang="ts" setup>
import type { VerifyAuthMethod, VerifyAuthOptions } from '../types'

/**
 * Step 1: Authentication Method Selection
 * Displays available authentication methods for user to choose
 * Uses WForm with dialogPreset: 'modal' - consistent with project patterns
 */

defineOptions({
  name: 'WCompBusinessVerifyAuthMethodSelect',
})

const props = defineProps<{
  /** List of available authentication methods */
  methods: VerifyAuthMethod[]
  /** Whether methods are being loaded */
  loading: boolean
  /** Component options */
  options: Required<VerifyAuthOptions>
}>()

const emit = defineEmits<{
  /** Method selected */
  (e: 'select', method: VerifyAuthMethod): void
  /** Cancelled */
  (e: 'cancel'): void
}>()

const { t } = useAppI18n()

/**
 * Filter enabled methods based on allowedMethods option
 */
const enabledMethods = computed(() => {
  if (!props.options.allowedMethods?.length) {
    return props.methods.filter(m => m.enabled)
  }
  return props.methods.filter(m =>
    m.enabled && props.options.allowedMethods!.includes(m.type),
  )
})

/**
 * Handle method card click
 */
function onMethodClick(method: VerifyAuthMethod) {
  emit('select', method)
}

/**
 * Handle modal close
 */
function onClose() {
  emit('cancel')
}

/**
 * Get method count for slot path
 */
const _methodCount = computed(() => enabledMethods.value.length)

const { stateRef: formData } = useState({
  methodSelectContent: null,
})

const [register, { onOpen, onClose: _closeModal }] = useForm<typeof formData.value>({
  dialogPreset: 'modal',
  dialogProps: {
    width: '480px',
    closable: true,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    fullscreen: false,
    title: computed(() => t(props.options.title)),
    onNo: () => {
      onClose()
    },
  },
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

onMounted(onOpen)
</script>

<template>
  <!-- @vue-generic {typeof formData.value} -->
  <WForm :model="formData" @hook="register">
    <template #methodSelectContent>
      <div class="w-full">
        <!-- Description -->
        <div class="mb-6 text-center">
          <p class="text-sm text-gray-500">
            {{ t(options.description) }}
          </p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
          <NSpin size="large" />
        </div>

        <!-- Empty state -->
        <NEmpty
          v-else-if="enabledMethods.length === 0"
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
</template>
