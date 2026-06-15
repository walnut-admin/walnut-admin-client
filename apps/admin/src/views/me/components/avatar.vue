<script lang="ts" setup>
defineOptions({
  name: 'WAvatar',
  defaultView: false,
})

withDefaults(defineProps<{ value?: string, size?: number }>(), {
  size: 4,
})

const userStoreProfile = useAppStoreUserProfile()
</script>

<template>
  <n-avatar
    :style="{ height: `${size}rem`, width: `${size}rem` }"
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
