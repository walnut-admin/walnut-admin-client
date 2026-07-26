<script lang="ts" setup>
import type { ProgressStatus } from 'naive-ui'
import type { EffectScope } from 'vue'
import type { ICompExtraPasswordProps } from '.'
import { zxcvbnAsync } from '@zxcvbn-ts/core'
import { statusTable } from './utils'

defineOptions({
  name: 'WCompExtraPasswordInput',
})

const {
  maxlength = 80,
  minlength = 8,
  progress = false,
  capslock = false,
} = defineProps<ICompExtraPasswordProps>()

const emits = defineEmits<{ submit: [] }>()

const value = defineModel<string | null | undefined>('value', { required: true })

const percentage = ref(0)
const status = ref<ProgressStatus>('success')

async function calculatePasswordStrength(password: string | null | undefined) {
  if (!password) {
    percentage.value = 0
    status.value = 'success'
    return
  }

  try {
    const result = await zxcvbnAsync(password)
    const score = result?.score ?? 0

    status.value = statusTable[score]
    percentage.value = (score + 1) * 20
  }
  catch (error) {
    console.error('Password strength calculation failed:', error)
    percentage.value = 0
    status.value = 'success'
  }
}

let scope: EffectScope

if (progress) {
  scope = effectScope()

  scope.run(() => {
    const debouncedCalculate = useDebounceFn(calculatePasswordStrength, 200)

    watch(
      () => value.value,
      (newValue) => {
        debouncedCalculate(newValue)
      },
      { immediate: true },
    )
  })
}

onUnmounted(() => {
  scope?.stop()
})

function onKeyup() {
  emits('submit')
}
</script>

<template>
  <div class="w-full">
    <WCapsLockTooltip :lock="capslock">
      <template #default="{ onTargetBlur, onTargetFocus }">
        <n-input
          v-model:value="value"
          type="password"
          show-password-on="click"
          :placeholder="placeholder"
          :maxlength="maxlength"
          :minlength="minlength"
          clearable
          :input-props="{
            autocomplete: 'current-password',
          }"
          @keyup.enter="onKeyup"
          @focus="onTargetFocus"
          @blur="onTargetBlur"
        />
      </template>
    </WCapsLockTooltip>

    <n-progress
      v-if="progress"
      class="mt-2"
      :height="10"
      type="line"
      :percentage="percentage"
      :show-indicator="false"
      :status="status"
    />
  </div>
</template>
