<script lang="ts" setup>
defineOptions({
  name: 'WAvatar',
  defaultView: false,
})

withDefaults(defineProps<{ value?: string, size?: number }>(), {
  size: 24,
})

const userStoreProfile = useAppStoreUserProfile()
</script>

<template>
  <n-avatar
    :style="{ height: `${size}px`, width: `${size}px` }"
    :src="value ?? userStoreProfile.getAvatar"
    circle
    alt="avatar"
    object-fit="cover"
  >
    <span v-if="!value && !userStoreProfile.getAvatar">
      {{ userStoreProfile.getDisplayName }}
    </span>
  </n-avatar>
</template>
