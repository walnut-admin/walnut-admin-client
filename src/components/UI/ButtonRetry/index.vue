<script lang="ts" setup>
import type { ICompUIButtonRetryProps } from '.'
import type { ICompUIButtonProps } from '../Button'

defineOptions({
  name: 'WCompUIButtonRetry',
})

const { retrySeconds = 60, retryKey } = defineProps<ICompUIButtonRetryProps>()
const emits = defineEmits<{ click: [e: MouseEvent], retryClick: [startCountDown: Fn] }>()

const attrs: ICompUIButtonProps = useAttrs()

const { retryText, resume } = useCountdownStorage({ persistKey: retryKey, persistSeconds: retrySeconds })

function onButtonClick(e: MouseEvent) {
  emits('click', e)
  emits('retryClick', () => resume())
}

defineExpose({
  onStartCountdown: () => resume(),
})
</script>

<template>
  <WButton
    :disabled="!!retryText"
    :debounce="0"
    :text-prop="retryText ?? attrs.textProp"
    @click="onButtonClick"
  >
    <slot />
  </WButton>
</template>
