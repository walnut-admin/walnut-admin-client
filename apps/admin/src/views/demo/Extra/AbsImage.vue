<script lang="ts" setup>
import type { WCompExtraAbsImageInst } from '@/components/Extra/AbsImage'
import { downloadByBase64, downloadByBlob, downloadByUrl } from '@/utils/file/download'

defineOptions({
  name: 'AbsImageDemo',
  defaultView: false,
})

const blobURL = shallowRef<string>()
const base64 = shallowRef<string>()
const hasFile = ref(false)
const fileName = ref<string>()

const absImageRef = useTemplateRef<WCompExtraAbsImageInst>('absImageRef')

async function onRenderBlobURL() {
  const res = await absImageRef.value?.onGetBlobURL()
  blobURL.value = res
}

async function onRenderBase64() {
  const res = await absImageRef.value?.onGetBase64()
  base64.value = res
}

async function onDownloadByUrl() {
  await downloadByUrl(blobURL.value!, fileName.value)
}

async function onDownloadBybase64() {
  await downloadByBase64(base64.value!, fileName.value)
}

async function onDownloadByBlob() {
  const blob = absImageRef.value?.onGetBlob()
  await downloadByBlob(blob!, fileName.value)
}
</script>

<template>
  <WDemoCard title="Abstract Image operations, download/transform">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Abstract image
        </WTitle>

        <n-space vertical>
          <WAbsImage ref="absImageRef" @change="hasFile = true">
            <n-button>{{ hasFile ? 'Got image' : 'No image yet' }}</n-button>
          </WAbsImage>

          <n-input
            v-model:value="fileName"
            placeholder="download file name"
          />

          <n-space>
            <n-button :disabled="!hasFile" @click="onDownloadByUrl">
              download by url
            </n-button>

            <n-button :disabled="!hasFile" @click="onDownloadBybase64">
              download by base64
            </n-button>

            <n-button :disabled="!hasFile" @click="onDownloadByBlob">
              download by blob
            </n-button>

            <n-space vertical>
              <n-button :disabled="!hasFile" @click="onRenderBase64">
                render base64
              </n-button>

              <n-image
                v-if="base64"
                :src="base64"
                alt="base64 render"
                class="h-48 w-48"
              />
            </n-space>

            <n-space vertical>
              <n-button :disabled="!hasFile" @click="onRenderBlobURL">
                render blobURL
              </n-button>

              <n-image
                v-if="blobURL"
                :src="blobURL"
                alt="blobURL render"
                class="h-48 w-48"
              />
            </n-space>
          </n-space>
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
