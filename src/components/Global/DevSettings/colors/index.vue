<script lang="ts" setup>
import { getThemeColors } from './utils'

defineOptions({
  name: 'WAppSettingsColor',
})

const { disabled = false } = defineProps<{ disabled?: boolean }>()

const value = defineModel<string>('value', { required: true })

const getColors = getThemeColors(value.value)

function onClick(color: string) {
  if (disabled)
    return
  value.value = color
}
</script>

<template>
  <div class="grid grid-cols-9 w-full gap-2">
    <span
      v-for="(item, index) in getColors"
      :key="index"
      class="aspect-square flex items-center justify-center border-1 border-primary rounded transition-transform duration-200"
      :class="[
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:scale-105',
      ]"
      :style="{ background: item }"
      :title="item"
      @click="onClick(item)"
    >
      <WIcon v-if="item === value" icon="ant-design:check-outlined" />
    </span>
  </div>
</template>
