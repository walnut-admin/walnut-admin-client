<script lang="ts" setup>
import type { ICompUIColorPickerProps } from '.'

defineOptions({
  name: 'WCompUIColorPicker',
})

defineProps<ICompUIColorPickerProps>()

const inputValue = defineModel<string>('value')
const showValue = defineModel<boolean>('show', { default: false })

function onChooseColor(sRGB: string) {
  inputValue.value = sRGB
  showValue.value = false
}
</script>

<template>
  <n-color-picker v-model:value="inputValue" v-model:show="showValue" show-preview>
    <template v-if="eyeDropper" #action>
      <WEyedropper @choose="onChooseColor" />
    </template>
  </n-color-picker>
</template>
