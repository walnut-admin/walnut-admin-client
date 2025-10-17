<script lang="ts" setup>
import type { AppTabUtilListItem } from '../types'

defineProps<{ lists: AppTabUtilListItem[] }>()
</script>

<template>
  <div>
    <div v-for="item in lists" :key="item.icon" class="flex items-center">
      <n-tooltip trigger="hover" placement="bottom">
        <template #default>
          {{ item.helpMessage() }}
        </template>

        <template #trigger>
          <WIcon
            height="20"
            class="m-1 my-auto cursor-pointer rounded-lg transition-all duration-200 hover:scale-105 hover:bg-primary/10 hover:ring-1 hover:ring-primary/50"
            :icon="item.icon"
            @click="item.event"
          />
        </template>
      </n-tooltip>
    </div>
  </div>
</template>
