<script lang="ts" setup>
import type { ICompExtraDemoCardProps } from '.'

defineOptions({
  name: 'WCompExtraDemoCard',
})

defineProps<ICompExtraDemoCardProps>()
</script>

<template>
  <div>
    <WCard header-preset="collapse">
      <template #header>
        <WTitle :help-message="description">
          {{ title }}
        </WTitle>
      </template>
      <template #default>
        <slot />
      </template>
    </WCard>
  </div>
</template>
