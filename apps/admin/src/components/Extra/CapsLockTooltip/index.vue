<script lang="ts" setup>
defineOptions({
  name: 'WCompExtraCapsLockToolTip',
})

withDefaults(defineProps<{ lock?: boolean }>(), { lock: false })

const tooltipShow = ref(false)
const isFocus = ref(false)
const capsLockState = useKeyModifier('CapsLock')

function onShowTooltip() {
  if (!isFocus.value)
    return

  if (capsLockState.value)
    tooltipShow.value = true
  else
    tooltipShow.value = false
}

watchEffect(onShowTooltip)

function onTargetFocus() {
  isFocus.value = true
}

function onTargetBlur() {
  isFocus.value = false
  tooltipShow.value = false
}
</script>

<template>
  <n-tooltip v-if="lock" v-model:show="tooltipShow" trigger="manual" placement="right">
    <template #default>
      {{ $t('comp.password.capslock') }}
    </template>
    <template #trigger>
      <slot v-bind="{ onTargetFocus, onTargetBlur }" />
    </template>
  </n-tooltip>

  <slot v-else v-bind="{ onTargetFocus, onTargetBlur }" />
</template>
