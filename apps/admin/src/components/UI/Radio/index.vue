<script lang="ts" setup>
import type { ICompUIRadioProps } from '.'

defineOptions({
  name: 'WCompUIRadio',
})

withDefaults(defineProps<ICompUIRadioProps>(), { button: false })
</script>

<template>
  <n-radio-group>
    <template v-if="!button">
      <n-space>
        <n-radio v-for="item in options" v-bind="item" :key="(item.value as string)">
          {{ item.label }}
        </n-radio>
      </n-space>
    </template>
    <template v-else>
      <n-radio-button v-for="item in options" v-bind="item" :key="(item.value as string)">
        {{ item.label }}
      </n-radio-button>
    </template>
  </n-radio-group>
</template>
