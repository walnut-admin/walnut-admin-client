<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'
import type { WForm } from '@/components/UI/Form'

defineOptions({
  name: 'DialogForm',
  defaultView: false,
})

const configData = ref({
  preset: 'modal' as WForm.FormDialogPreset,
  maskClosable: true,
  closable: true,
  draggable: true,
  fullscreen: true,
  resizable: true,
  showInContent: false,
  closeConfirm: false,
  title: 'Title',
  height: 40,
  width: 40,
})

const formData = ref<Recordable>({})

const [register1] = useForm<typeof configData.value>({
  span: 8,
  labelWidth: 100,
  schemas: [
    {
      type: 'Base:Radio',
      formProp: {
        path: 'preset',
        label: 'Preset',
      },
      componentProp: {
        button: true,
        options: ['drawer', 'modal'].map(i => ({
          label: i,
          value: i,
        })),
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'maskClosable',
        label: 'Mask Close',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'closable',
        label: 'Closable',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'closeConfirm',
        label: 'Confirm before close',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'draggable',
        label: 'Draggable',
      },
      visibleProp: {
        vShow: computed(() => configData.value.preset === 'modal'),
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'fullscreen',
        label: 'Fullscreen',
      },
      visibleProp: {
        vShow: computed(() => configData.value.preset === 'modal'),
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'resizable',
        label: 'Resizable',
      },
      visibleProp: {
        vShow: computed(() => configData.value.preset === 'drawer'),
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        path: 'showInContent',
        label: 'Only show in content',
      },
      visibleProp: {
        vShow: computed(() => configData.value.preset === 'drawer'),
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        path: 'width',
        label: 'Width',
      },
      componentProp: {
        min: 0,
        max: 100,
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        path: 'title',
        label: 'Title',
      },
      componentProp: {
        clearable: true,
      },
    },
  ],
})

const [register2, { onOpen }] = useForm<typeof formData.value>({
  dialogPreset: computed(() => configData.value.preset),
  dialogProps: {
    maskClosable: computed(() => configData.value.maskClosable),
    closeConfirm: computed(() => configData.value.closeConfirm),
    closable: computed(() => configData.value.closable),
    draggable: computed(() => configData.value.draggable),
    fullscreen: computed(() => configData.value.fullscreen),
    resizable: computed(() => configData.value.resizable),
    showInContent: computed(() => configData.value.showInContent),
    defaultWidth: computed(() => `${configData.value.width}%`),
    width: computed(() => `${configData.value.width}%`),
    height: computed(() => `${configData.value.height}%`),
    title: computed(() => configData.value.title),
    onYes: (_, done) => {
      const id = setTimeout(() => {
        useAppMessage().success('Success')
        done()
        formData.value = {}
        clearTimeout(id)
      }, 2000)
    },
    onNo: (close) => {
      close()
    },
  },
  labelWidth: 80,
  schemas: Array.from({ length: 4 }, (v, k) => {
    return {
      type: 'Base:Input',
      formProp: {
        label: `Input ${k + 1}`,
        path: `input${k + 1}`,
        rule: {
          required: true,
          trigger: 'change',
        },
      },
    }
  }),
})

function onOpenAdvacned() {
  const id = setTimeout(() => {
    onOpen((done) => {
      const id2 = setTimeout(() => {
        done()
        clearTimeout(id2)
      }, 2000)
    })
    clearTimeout(id)
  }, 500)
}
</script>

<template>
  <WDemoCard title="Dialog Form" description="Form implement with modal/drawer">
    <WForm :model="configData" @hook="register1" />

    <WJSON :value="formData" />

    <n-button @click="onOpenAdvacned">
      Open Dialog Form
    </n-button>

    <WForm :model="formData" @hook="register2" />
  </WDemoCard>
</template>
