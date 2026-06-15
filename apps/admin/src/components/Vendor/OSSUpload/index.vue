<script lang="ts" setup>
import type {
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst,
} from 'naive-ui'

import type { ICompVendorOSSUploadProps } from '.'
import { genString } from 'easy-fns-ts'
import { downloadByUrl } from '@/utils/file/download'
import { AliOSSClient } from './client'

defineOptions({
  name: 'WCompVendorOSSUpload',
})

const props = withDefaults(defineProps<ICompVendorOSSUploadProps>(), {
  region: 'oss-cn-beijing',
  bucket: 'walnut-demo',
  folder: 'example',
  max: 3,
  size: 1024 * 1,
  crossoverSize: 1024 * 5,
  download: true,
  remove: true,
  preview: true,
})

const value = defineModel<string[]>('value', { default: [] })

const { t } = useAppI18n()

const uploadRef = useTemplateRef<UploadInst>('uploadRef')
const fileList = ref<UploadFileInfo[]>()

const getChooseDisabled = computed(
  () => props.disabled || (fileList.value && fileList.value.length >= props.max),
)

const getUploadLoading = computed(
  () =>
    fileList.value
    && fileList.value.some(({ status }) => status === 'uploading'),
)

const getUploadDisabled = computed(
  () =>
    props.disabled
    || !fileList.value
    || fileList.value.length === 0
    || fileList.value.every(({ status }) => status === 'finished')
    || getUploadLoading.value,
)

function onCustomRequest({
  file,
  data: _data,
  headers: _headers,
  withCredentials: _withCredentials,
  action: _action,
  onFinish,
  onError,
  onProgress,
}: UploadCustomRequestOptions) {
  const formData = new FormData()

  // if (data) {
  //   Object.keys(data).forEach((key) => {
  //     formData.append(
  //       key,
  //       data[key as keyof UploadCustomRequestOptions['data']]
  //     )
  //   })
  // }

  formData.append(file.name, file.file!)

  ;(file.file!.size <= props.crossoverSize * 1024
    ? AliOSSClient.instance.upload(file, props.folder)
    : AliOSSClient.instance.multiUpload(file, props.folder, onProgress)
  )
    .then((data) => {
      const { id, value: _value } = data!

      onFinish()

      const index = fileList.value!.findIndex(i => i.id === id)

      // replace url
      if (index !== -1)
        fileList.value![index].url = AliOSSClient.instance.getFullUrl(_value)

      value.value = fileList.value?.filter(i => i.status === 'finished').map(item => item.name) as string[]
    })
    .catch(() => {
      onError()
    })
}

async function onRemove(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  const index = fileList.value!.findIndex(i => i.id === data.file.id)

  if (index !== -1) {
    fileList.value!.splice(index, 1)

    await AliOSSClient.instance.abortMultipartUpload()
  }
}

function onUpload(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
  uploadRef.value?.submit()
}

function onDownload(file: UploadFileInfo) {
  downloadByUrl(file.url!, file.name)
}

function onBeforeUpload(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  if (data.file.file!.size / 1024 > props.size) {
    useAppMessage().error(
      `File size should not be more than ${props.size / 1024}M`,
    )
    return false
  }

  return true
}

watch(
  () => value.value,
  async (v) => {
    if (v && v.length) {
      fileList.value = v.map(i => ({
        id: genString(8),
        name: i,
        status: 'finished',
        url: AliOSSClient.instance.getFullUrl(`${props.folder}/${i}`),
      }))
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<template>
  <div>
    <n-button
      v-if="image"
      :disabled="getUploadDisabled"
      :loading="getUploadLoading"
      class="mb-2"
      @click="onUpload"
    >
      {{ t('comp.alioss.upload') }}
    </n-button>

    <n-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :abstract="!image"
      :custom-request="onCustomRequest"
      :default-upload="false"
      :list-type="image ? 'image-card' : undefined"
      :disabled="disabled"
      :show-download-button="download"
      :show-remove-button="remove"
      :show-preview-button="preview"
      :max="max"
      :accept="image ? '.jpg, .jpeg, .png' : accept"
      :multiple="max > 0 && max !== 1"
      @download="onDownload"
      @remove="onRemove"
      @before-upload="onBeforeUpload"
    >
      <template v-if="image">
        <WIcon icon="ant-design:plus-outlined" />
      </template>

      <template v-else>
        <n-space size="small">
          <n-upload-trigger #="{ handleClick }" abstract>
            <n-button :disabled="getChooseDisabled" @click="handleClick">
              {{ t('comp.alioss.choose') }}
            </n-button>
          </n-upload-trigger>

          <n-button
            :disabled="getUploadDisabled"
            :loading="getUploadLoading"
            @click="onUpload"
          >
            {{
              getUploadLoading
                ? t('comp.alioss.uploading')
                : t('comp.alioss.upload')
            }}
          </n-button>
        </n-space>

        <div class="mt-2">
          <n-upload-file-list />
        </div>
      </template>
    </n-upload>
  </div>
</template>
