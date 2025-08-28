<script lang="ts" setup>
import type { WAvatarUploadInst } from '@/components/Business/AvatarUpload'

defineOptions({
  name: 'AvatarUploadDemo',
  defaultView: false,
})

const userStoreProfile = useAppStoreUserProfile()

const avatarUpload = useTemplateRef<WAvatarUploadInst>('avatarUpload')

const avatarCropperUrl = ref<string>()

function onAvatarChange(cropperUrl: string) {
  avatarCropperUrl.value = cropperUrl
}

function onUploadSuccess(newAvatar: string) {
  userStoreProfile.setAvatar(newAvatar)
}

async function onUploadAvatar() {
  const isSuccess = await avatarUpload.value?.onOSSUpload()

  if (isSuccess) {
    useAppMsgSuccess()
  }
  else {
    useAppMsgInfo('Upload avatar fail')
  }
}
</script>

<template>
  <WDemoCard title="Avatar Upload Demo">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic
        </WTitle>

        <WJSON :value="{ avatarCropperUrl }" />

        <WAvatarUpload
          ref="avatarUpload"
          @change="onAvatarChange"
          @success="onUploadSuccess"
        />

        <n-button class="mt-2" @click="onUploadAvatar">
          Upload
        </n-button>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
