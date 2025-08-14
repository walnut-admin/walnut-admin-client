<script lang="ts" setup>
import type { ICompExtraTextScrollProps } from '..'
import { getDefaultSlotText } from '@/utils/shared'
import TextScrollHorizontal from './Horizontal.vue'
import TextScrollVertical from './Vertical.vue'

defineOptions({
  name: 'WCompExtraTextScroll',
})

const props = withDefaults(defineProps<ICompExtraTextScrollProps>(), {
  maxLength: 8,
  mode: 'horizontal',
})
const slots = useSlots()

const slotsText = getDefaultSlotText(slots)

const getTexts = computed(() => slotsText
  ? Array.from({ length: 4 }, () => slotsText)
  : props.texts)
</script>

<template>
  <TextScrollHorizontal v-if="mode === 'horizontal'" v-bind="$props" :texts="getTexts" />
  <TextScrollVertical v-else v-bind="$props" :texts="getTexts" />
</template>
