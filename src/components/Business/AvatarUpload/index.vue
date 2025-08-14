<script lang="ts" setup>
import type { WCropperInst } from '@/components/Vendor/Cropper'
import { imgUrlToBase64 } from '@/utils/file/base64'
import { AliOSSClient } from '../../Vendor/OSSUpload/client'

defineOptions({
  name: 'WCompBusinessAvatarUpload',
})

const emits = defineEmits<{ change: [cropperUrl: string], success: [newAvatar: string] }>()

const { t } = useAppI18n()

const userProfile = useAppStoreUserProfile()
const userId = userProfile.profile._id!

const show = ref(false)
const loading = ref(false)
const cropperUrl = ref<string>()
const avatarUrl = ref<string>()

const cropperRef = useTemplateRef<WCropperInst>('cropperRef')

function onYes() {
  if (cropperUrl.value)
    emits('change', cropperUrl.value)

  show.value = false
}

function onNo() {
  show.value = false
}

async function onOSSUpload() {
  if (!cropperUrl.value)
    return false

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
  }
}

defineExpose({
  onOSSUpload,
})

onMounted(async () => {
  // to fix cors error, transform url to base64
  avatarUrl.value = await imgUrlToBase64(userProfile.getAvatar)
})
</script>

<template>
  <div>
    <n-button @click="show = true">
      {{ t('comp:avatar-upload:button') }}
    </n-button>

    <WModal
      v-model:show="show"
      :title="t('comp:avatar-upload:title')"
      width="60vw"
      :auto-focus="false"
      :loading="loading"
      display-directive="show"
      @yes="onYes"
      @no="onNo"
    >
      <WCropper
        ref="cropperRef"
        v-model:value="cropperUrl"
        v-model:src="avatarUrl"
        alt="Avatar"
      />
    </WModal>
  </div>
</template>
