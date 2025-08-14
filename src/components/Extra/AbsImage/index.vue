<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'
import { blobToBase64 } from '@/utils/file/base64'

defineOptions({
  name: 'WCompExtraAbsImage',
})

const emits = defineEmits<{ change: [] }>()

const currentFile = shallowRef<Blob>()
const objectUrl = useObjectUrl(currentFile)

async function onUploadChange(options: { file: UploadFileInfo }) {
  currentFile.value = options.file.file!

  emits('change')
}

defineExpose({
  onGetBlobURL: () => objectUrl.value,
  onGetBase64: () => blobToBase64(currentFile.value!),
  onGetBlob: () => currentFile.value,
})
</script>

<template>
  <n-upload
    :default-upload="false"
    :show-file-list="false"
    accept=".jpg, .jpeg, .png"
    @change="onUploadChange"
  >
    <slot />
  </n-upload>
</template>
