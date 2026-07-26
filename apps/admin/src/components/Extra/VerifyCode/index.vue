<script lang="ts" setup>
import type { ICompExtraVerifyCodeProps } from '.'
import { useFormItem } from 'naive-ui/es/_mixins'

defineOptions({
  name: 'WCompExtraVerifyCode',
})

const props = defineProps<ICompExtraVerifyCodeProps>()

const formItem = useFormItem(props)
const { nTriggerFormInput, mergedDisabledRef, mergedStatusRef, mergedSizeRef } = formItem

const OTPValue = ref<string[]>()

const value = defineModel<string>('value')

watch(
  () => OTPValue.value,
  (v) => {
    if (!v || !v.length)
      return
    value.value = v.join('')
  },
)

const buttonRef = useTemplateRef<{ onStartCountdown: Fn }>('buttonRef')

function onStartButtonCountdown() {
  buttonRef.value?.onStartCountdown()
}

async function onClick() {
  if (!props?.onBeforeCountdown) {
    onStartButtonCountdown()
    return
  }

  const canVerify = await props.onBeforeCountdown()

  if (canVerify) {
    onStartButtonCountdown()
  }
}

async function onOTPFinish() {
  await nextTick()
  nTriggerFormInput()
  props.onFinish!(value.value!)
}
</script>

<template>
  <div class="grid grid-cols-24">
    <n-input-otp
      v-model:value="OTPValue"
      class="col-span-18 mr-2"
      :status="mergedStatusRef"
      :disabled="mergedDisabledRef"
      :size="mergedSizeRef"
      @finish="onOTPFinish"
    />

    <WButtonRetry
      ref="buttonRef"
      class="col-span-6"
      type="info"
      text
      :retry-seconds="retrySeconds"
      :retry-key="retryKey"
      @click="onClick"
    >
      {{ $t('comp.verifyInput.send') }}
    </WButtonRetry>
  </div>
</template>
