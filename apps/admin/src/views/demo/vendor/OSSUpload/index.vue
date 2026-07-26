<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'

defineOptions({
  name: 'OSSUploadDemo',
})

const configData = ref({
  disabled: false,
  max: 3,
  size: 1024,
  crossoverSize: 1024 * 5,
  download: true,
  remove: true,
  preview: true,
})

const [register] = useForm<typeof configData.value>({
  span: 12,
  xGap: 20,
  schemas: [
    {
      type: 'Base:Switch',
      formProp: {
        path: 'disabled',
        label: 'Disabled',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'download',
        label: 'Download',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'remove',
        label: 'Remove',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'preview',
        label: 'Preview',
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        path: 'max',
        label: 'Max file count',
      },
      componentProp: {
        min: 0,
        max: 10,
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        path: 'size',
        label: 'File KB limit',
      },
      componentProp: {
        min: 0,
        max: 8192,
        step: 1024,
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        path: 'crossoverSize',
        label: 'Threhold to trigger multipart upload',
      },
      componentProp: {
        min: 1024,
        max: 8192,
        step: 1024,
      },
    },
  ],
})

const formData = ref<Recordable>({
  fileList1: ['city.jpg', 'football.jpg'],
  fileList2: ['test-png.png', 'test-docx.docx', 'test-pdf.pdf'],
})
</script>

<template>
  <WDemoCard title="Highly packaged ali oss use demo">
    <n-list>
      <n-list-item>
        <WDemoCard title="Basic Usage">
          <WForm :model="configData" @hook="register" />

          <n-space vertical>
            <WTitle prefix="bar" class="mb-2">
              Image Upload
            </WTitle>

            <WJSON :value="formData.fileList1" />

            <WOSSUpload
              v-model:value="formData.fileList1"
              image
              :disabled="configData.disabled"
              :max="configData.max"
              :size="configData.size"
              :crossover-size="configData.crossoverSize"
              :download="configData.download"
              :remove="configData.remove"
              :preview="configData.preview"
            />

            <WTitle prefix="bar" class="mb-2">
              Normal Upload
            </WTitle>

            <WJSON :value="formData.fileList2" />

            <WOSSUpload
              v-model:value="formData.fileList2"
              :disabled="configData.disabled"
              :max="configData.max"
              :size="configData.size"
              :crossover-size="configData.crossoverSize"
              :download="configData.download"
              :remove="configData.remove"
              :preview="configData.preview"
            />
          </n-space>
        </WDemoCard>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
