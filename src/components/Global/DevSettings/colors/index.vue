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
  <div class="hstack space-x-3">
    <span
      v-for="(item, index) in getColors" :key="index"
      class="h-5 w-5 flex items-center justify-center border-1 border-primary rounded"
      :class="[
        { 'cursor-pointer': !disabled },
        { 'cursor-not-allowed opacity-50': disabled },
      ]"
      :style="{ background: item }"
      :title="item"
      @click="onClick(item)"
    >
      <WIcon v-if="item === value" icon="ant-design:check-outlined" />
    </span>
  </div>
</template>
