<script lang="ts" setup>
import type { ICompUIDynamicTagsProps } from '.'

defineOptions({
  name: 'WCompUIDynamicTags',
})

defineProps<ICompUIDynamicTagsProps>()
</script>

<template>
  <n-dynamic-tags />
</template>
