<script lang="ts" setup>
import type { WCropperInst } from '@/components/Vendor/Cropper'
import { imgUrlToBase64 } from '@/utils/file/base64'
import { AliOSSClient } from '../../Vendor/OSSUpload/client'

defineOptions({
  name: 'WCompBusinessAvatarUpload',
})

const emits = defineEmits<{ change: [cropperUrl: string], success: [newAvatar: string] }>()

const { t } = useAppI18n()

const userStoreProfile = useAppStoreUserProfile()
const userId = userStoreProfile.profile._id!

const show = ref(false)
const loading = ref(false)
const changed = ref(false)
const cropperUrl = ref<string>()
const srcUrl = ref<string>()

const cropperRef = useTemplateRef<WCropperInst>('cropperRef')

function onYes() {
  if (cropperUrl.value) {
    changed.value = true
    emits('change', cropperUrl.value)
  }

  show.value = false
}

function onNo() {
  show.value = false
}

async function onOSSUpload() {
  // no init user avatar yet
  if (!srcUrl.value) {
    return true
  }

  // no changed at all
  if (!changed.value) {
    return true
  }

  loading.value = true

  try {
    const client = await AliOSSClient.instance.getClient()

    const headers = {
      'Content-Disposition': encodeURIComponent(userId),
      'x-oss-forbid-overwrite': false,
    }

    const file = await cropperRef.value?.onGetCropperBlob()

    const result = await client.put(`avatar/${userId}.png`, file, {
      headers,
    })

    if (result.res.status === 200) {
      const newUrl = `${result.url}?t=${new Date().getTime()}`
      emits('success', newUrl)
      return true
    }

    return false
  }
  finally {
    loading.value = false
    changed.value = false
  }
}

function onOpenCropper() {
  show.value = true
}

function onFullScreen(isFullscreen: boolean) {
  if (isFullscreen) {
    cropperRef.value?.onRefresh()
  }
}

defineExpose({
  onOSSUpload,
})

watchEffect(async () => {
  // to fix cors error, transform url to base64
  if (userStoreProfile.getAvatar) {
    srcUrl.value = await imgUrlToBase64(userStoreProfile.getAvatar)
  }
})
</script>

<template>
  <div>
    <n-button @click="onOpenCropper">
      {{ t('comp:avatar-upload:button') }}
    </n-button>

    <WModal
      v-model:show="show"
      :title="t('comp:avatar-upload:title')"
      width="auto"
      :auto-focus="false"
      :loading="loading"
      display-directive="show"
      @yes="onYes"
      @no="onNo"
      @fullscreen="onFullScreen"
    >
      <WCropper
        ref="cropperRef"
        v-model:value="cropperUrl"
        v-model:src="srcUrl"
        alt="Avatar"
      />
    </WModal>
  </div>
</template>
